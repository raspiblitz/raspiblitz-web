module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      maxHeight: {
        88: '22rem',
        112: '28rem'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
