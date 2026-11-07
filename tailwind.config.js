/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        grain: {
          '0%,100%': { transform: 'translate(0,0)' },
          '20%': { transform: 'translate(-3%,2%)' },
          '40%': { transform: 'translate(2%,-3%)' },
          '60%': { transform: 'translate(-2%,-1%)' },
          '80%': { transform: 'translate(3%,3%)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        eq: {
          '0%,100%': { height: '25%' },
          '50%': { height: '100%' },
        },
        leak: {
          '0%,100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.15) translate(4%,3%)' },
        },
      },
      animation: {
        grain: 'grain 0.9s steps(4) infinite',
        leak: 'leak 12s ease-in-out infinite',
        eq: 'eq 0.8s ease-in-out infinite',
        marquee: 'marquee 60s linear infinite',
        'spin-slow': 'spin 22s linear infinite',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};