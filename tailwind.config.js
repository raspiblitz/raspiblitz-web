import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}",
  "./public/index.html",
  "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
];

export const theme = {
  extend: {
    animation: {
      'fadeIn': 'fadeIn 0.5s ease-in-out',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0', transform: 'translateY(10px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
    },
  },
};

export const plugins = [
  heroui({
    addCommonColors: true,
    themes: {
      light: {},
      dark: {
        colors: {
          primary: "#4785FF",
          secondary: "#BBC6DC",
          tertiary: "#253553",
        },
      },
    },
  }),
];
