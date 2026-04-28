import type { Config } from 'tailwindcss'

export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        'pt-serif': ['PT Serif', 'serif'],
      },
      fontSize: {
        'title': '48px',
      },
    },
  },
  plugins: [],
} satisfies Config
