/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        islamic: {
          950: "#022c22",
          900: "#064e3b",
          700: "#047857",
          500: "#10b981",
        },
        gold: {
          400: "#fbbf24",
          500: "#f59e0b",
        },
        legal: {
          900: "#881337",
          700: "#be123c",
          400: "#fb7185",
        },
      },
    },
  },
  plugins: [],
};
