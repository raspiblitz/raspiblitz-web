import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}",
  "./public/index.html",
  "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
];

export const plugins = [
  nextui({
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
