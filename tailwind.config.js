/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f1fcf2",
          100: "#defae3",
          200: "#bff3c8",
          300: "#8ee79e",
          400: "#3dcd58",
          500: "#2eb948",
          600: "#209938",
          700: "#1d782f",
          800: "#1c5f29",
          900: "#194e25",
          950: "#082b11",
        },
      },
      fontFamily: {
        sans: ["'ArialRoundedMTBold', sans-serif"],
      },
    },
  },
  plugins: [],
};
