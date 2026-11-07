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
        leak: {
          '0%,100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.15) translate(4%,3%)' },
        },
      },
      animation: {
        grain: 'grain 0.9s steps(4) infinite',
        leak: 'leak 12s ease-in-out infinite',
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