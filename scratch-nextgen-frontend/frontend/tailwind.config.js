/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fredoka', 'Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 45px rgba(31, 41, 55, 0.12)',
        play: '0 10px 24px rgba(16, 185, 129, 0.35)',
        stop: '0 10px 24px rgba(244, 63, 94, 0.28)',
        sticker: '0 8px 0 rgba(15, 23, 42, 0.08)',
      },
      colors: {
        grape: '#7C3AED',
        ocean: '#0891B2',
        mango: '#F59E0B',
        grass: '#22C55E',
        bubble: '#FDF2F8',
        stage: '#7DD3FC',
      },
      minHeight: {
        tap: '48px',
      },
      keyframes: {
        'kid-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'kid-wiggle': {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        'kid-pop': {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'kid-float': 'kid-float 3.6s ease-in-out infinite',
        'kid-wiggle': 'kid-wiggle 1.8s ease-in-out infinite',
        'kid-pop': 'kid-pop 0.28s ease-out',
      },
    },
  },
  plugins: [],
};
