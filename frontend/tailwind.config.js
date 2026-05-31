/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', '"Be Vietnam Pro"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['"Be Vietnam Pro"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          DEFAULT: '#0b1220',
          950: '#070b14',
          900: '#0f172a',
          800: '#1e293b',
        },
        brand: {
          DEFAULT: '#16a676',
          dark: '#087c5b',
          light: '#34d399',
        },
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1d4ed8',
        },
        secondary: {
          DEFAULT: '#7c3aed',
          dark: '#6d28d9',
        },
        accent: {
          DEFAULT: '#ef4444',
          dark: '#dc2626',
        },
        warning: {
          DEFAULT: '#facc15',
          dark: '#cc9900ff',
        },
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -12px rgba(15,23,42,0.12)',
        'soft-lg': '0 2px 4px rgba(15,23,42,0.04), 0 24px 60px -20px rgba(15,23,42,0.25)',
        'glow-emerald': '0 18px 60px -18px rgba(16,166,118,0.55)',
        'inset-soft': 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(18px) translateX(10px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.85)', opacity: 0.6 },
          '80%, 100%': { transform: 'scale(1.8)', opacity: 0 },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.8s ease-out forwards',
        fadeIn: 'fadeIn 0.6s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 9s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        blink: 'blink 1.1s step-end infinite',
        shimmer: 'shimmer 2.2s infinite',
        'pulse-ring': 'pulseRing 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow': 'spinSlow 18s linear infinite',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #2563eb, #7c3aed)',
        'mesh-hero':
          'radial-gradient(at 18% 22%, rgba(16,166,118,0.35) 0px, transparent 45%), radial-gradient(at 82% 18%, rgba(59,130,246,0.30) 0px, transparent 45%), radial-gradient(at 75% 85%, rgba(139,92,246,0.30) 0px, transparent 45%), radial-gradient(at 20% 80%, rgba(247,183,51,0.20) 0px, transparent 45%)',
      },
    },
  },
  plugins: [],
}
