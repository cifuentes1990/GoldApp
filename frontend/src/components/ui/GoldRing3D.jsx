import { useRef, Suspense, Component } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Torus, Float, Stars } from '@react-three/drei'

// ─── Animated gold torus ──────────────────────────────────────────────────────
function Ring({ position = [0, 0, 0], scale = 1, speed = 1, color = '#F5B042' }) {
  const mesh = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    mesh.current.rotation.x = Math.sin(t * 0.4 * speed) * 0.3
    mesh.current.rotation.y += 0.008 * speed
    mesh.current.rotation.z = Math.cos(t * 0.3 * speed) * 0.15
  })
  return (
    <Torus ref={mesh} args={[1, 0.28, 64, 128]} position={position} scale={scale}>
      <meshStandardMaterial color={color} metalness={0.9} roughness={0.15} />
    </Torus>
  )
}

// ─── Orbiting gem ─────────────────────────────────────────────────────────────
function OrbitingGem({ radius = 2.5, speed = 0.6, phase = 0, color = '#F5B042' }) {
  const mesh = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + phase
    mesh.current.position.x = Math.cos(t) * radius
    mesh.current.position.y = Math.sin(t * 0.7) * 0.8
    mesh.current.position.z = Math.sin(t) * radius * 0.4
    mesh.current.rotation.y += 0.04
  })
  return (
    <mesh ref={mesh}>
      <octahedronGeometry args={[0.18, 0]} />
      <meshStandardMaterial color={color} metalness={1} roughness={0.05} />
    </mesh>
  )
}

// ─── Scene (no external assets — pure lights) ─────────────────────────────────
function Scene() {
  return (
    <>
      {/* Manual lighting — no HDR/environment file needed */}
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 4, 4]}   intensity={3}   color="#F5B042" />
      <pointLight position={[-4, -2, 3]} intensity={1.5} color="#ffffff" />
      <pointLight position={[0, -4, -2]} intensity={1}   color="#C88B2A" />
      <directionalLight position={[0, 5, 2]} intensity={1} color="#FFD700" />

      <Stars radius={40} depth={20} count={500} factor={2} fade speed={0.4} />

      <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.5}>
        <Ring scale={1.5} speed={0.9} color="#F5B042" />
      </Float>

      <Float speed={2.2} rotationIntensity={0.2} floatIntensity={0.3}>
        <Ring scale={0.75} speed={1.4} color="#E8A020" position={[0.3, 0.2, -0.5]} />
      </Float>

      <OrbitingGem radius={2.4} speed={0.5} phase={0}    color="#F5B042" />
      <OrbitingGem radius={2.4} speed={0.5} phase={2.09} color="#FFD700" />
      <OrbitingGem radius={2.4} speed={0.5} phase={4.19} color="#C88B2A" />
      <OrbitingGem radius={1.6} speed={0.8} phase={1.05} color="#F5B042" />
    </>
  )
}

// ─── Error boundary — if WebGL fails, render nothing (page stays intact) ──────
class CanvasBoundary extends Component {
  constructor(props) { super(props); this.state = { error: false } }
  static getDerivedStateFromError() { return { error: true } }
  render() { return this.state.error ? null : this.props.children }
}

// ─── Exported canvas ──────────────────────────────────────────────────────────
export default function GoldRing3D({ className = '' }) {
  return (
    <CanvasBoundary>
      <div className={`w-full h-full ${className}`}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>
    </CanvasBoundary>
  )
}
