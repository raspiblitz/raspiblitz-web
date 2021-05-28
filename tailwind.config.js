module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'bd-yellow-light': '#F2C94C',
        'bd-yellow-dark': '#F7CB47'
      },
      maxHeight: {
        88: '22rem',
        112: '28rem'
      }
    }
  },
  variants: {
    extend: {
      opacity: ['disabled']
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
