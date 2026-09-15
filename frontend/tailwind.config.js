/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        bg: '#060816',
        panel: '#0b1222',
        panelSoft: '#121b2d',
        neon: '#7c3aed',
        mint: '#4ade80',
        sky: '#38bdf8',
        glow: '#a78bfa',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(167,139,250,.32), 0 20px 45px rgba(124,58,237,.2)',
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
};
