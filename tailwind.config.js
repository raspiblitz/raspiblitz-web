module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "bd-yellow-light": "#F2C94C",
        "bd-yellow-dark": "#F7CB47",
      },
    },
    minHeight: {
      144: "36rem",
    },
    maxWidth: {
      "4/5": "80%",
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      backgroundColor: ["disabled"],
      cursor: ["disabled"],
      textColor: ["disabled"],
    },
  },
};
