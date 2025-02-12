import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}",
  "./public/index.html",
  "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
];

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
