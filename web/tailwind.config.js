import COLORS from "./colors.json";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: COLORS,
    },
  },
  plugins: [],
};
