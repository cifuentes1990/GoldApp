/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F5B042',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        dark: {
          50: '#3A3A3A',
          100: '#2A2A2A',
          200: '#1E1E1E',
          300: '#1A1A1A',
          400: '#141414',
          500: '#0F0F0F',
          600: '#0A0A0A',
          700: '#050505',
          800: '#030303',
          900: '#000000',
        },
        neon: {
          cyan: '#00FFFF',
          gold: '#FFD700',
          amber: '#F5B042',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        display: ['Bebas Neue', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(245, 176, 66, 0.4)' },
          '50%': { boxShadow: '0 0 25px rgba(245, 176, 66, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        glow: {
          from: { textShadow: '0 0 5px #F5B042, 0 0 10px #F5B042' },
          to: { textShadow: '0 0 10px #F5B042, 0 0 25px #F5B042, 0 0 40px #F5B042' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F5B042 0%, #FFD700 50%, #F5B042 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },
    },
  },
  plugins: [],
}
