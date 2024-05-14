const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "bd-yellow-light": "#F2C94C",
        "bd-yellow-dark": "#F7CB47",
      },
    },
  },
  plugins: [
    nextui({
      addCommonColors: true,
      themes: {
        light: {},
        dark: {
          colors: {
            primary: "#4785FF",
            secondary: "#BBC6DC",
          },
        },
      },
    }),
  ],
};
