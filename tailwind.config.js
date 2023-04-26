/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#9E0B0F",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
