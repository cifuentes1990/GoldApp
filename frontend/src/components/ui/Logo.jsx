// Logo de GIORGIO — emblema de gema facetada con monograma "G" + wordmark.
// Reutilizable: <Logo /> (navbar), <Logo size="lg" /> (login), <Logo emblemOnly /> (ícono).

const SIZES = {
  sm: { emblem: 30, word: 'text-xl',  tag: 'text-[7px]'  },
  md: { emblem: 40, word: 'text-3xl', tag: 'text-[9px]'  },
  lg: { emblem: 56, word: 'text-4xl', tag: 'text-[10px]' },
}

export function LogoEmblem({ size = 40, className = '' }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 100 100"
      className={`logo-emblem ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="giorgioGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#FFE9A8" />
          <stop offset="35%"  stopColor="#F5B042" />
          <stop offset="70%"  stopColor="#E8A020" />
          <stop offset="100%" stopColor="#9C6410" />
        </linearGradient>
        <linearGradient id="giorgioShine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="giorgioGlow" cx="50%" cy="42%" r="55%">
          <stop offset="0%"  stopColor="#F5B042" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#F5B042" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Glow background */}
      <circle cx="50" cy="50" r="46" fill="url(#giorgioGlow)" className="logo-glow" />

      {/* Faceted gem outline (diamond) */}
      <g className="logo-gem">
        <path
          d="M50 6 L86 38 L50 94 L14 38 Z"
          fill="none" stroke="url(#giorgioGold)" strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Top facet lines */}
        <path d="M14 38 L86 38" stroke="url(#giorgioGold)" strokeWidth="1.5" opacity="0.55" />
        <path d="M50 6 L36 38 M50 6 L64 38" stroke="url(#giorgioGold)" strokeWidth="1.5" opacity="0.55" />
        <path d="M36 38 L50 94 M64 38 L50 94" stroke="url(#giorgioGold)" strokeWidth="1.2" opacity="0.4" />
      </g>

      {/* Monogram G */}
      <text
        x="50" y="60" textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="40" fontWeight="bold"
        fill="url(#giorgioGold)"
        className="logo-letter"
      >G</text>

      {/* Sparkle accent */}
      <g className="logo-sparkle">
        <path d="M50 2 L52 9 L50 16 L48 9 Z" fill="#FFE9A8" />
        <path d="M44 5 L50 7 L56 5 L50 9 Z" fill="#FFE9A8" opacity="0.8" />
      </g>

      {/* Top shine on gem */}
      <path d="M50 9 L80 36 L20 36 Z" fill="url(#giorgioShine)" opacity="0.25" />
    </svg>
  )
}

export default function Logo({ size = 'md', tagline = true, emblemOnly = false, className = '' }) {
  const s = SIZES[size] || SIZES.md
  if (emblemOnly) return <LogoEmblem size={s.emblem} className={className} />

  return (
    <span className={`inline-flex items-center gap-2.5 group ${className}`}>
      <LogoEmblem size={s.emblem} />
      <span className="flex flex-col leading-none">
        <span className={`font-display ${s.word} tracking-[0.18em] gold-text group-hover:glow-text transition-all duration-300`}>
          GIORGIO
        </span>
        {tagline && (
          <span className={`${s.tag} text-gold-600/70 tracking-[0.35em] uppercase mt-1 font-medium`}>
            Joyería · Oro
          </span>
        )}
      </span>
    </span>
  )
}
