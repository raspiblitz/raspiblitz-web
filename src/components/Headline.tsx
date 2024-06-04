import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export interface HeadlineProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: ReactNode;
  size?: FontSizes;
}

export const fontSizes = {
  "5xl": "text-5xl",
  "4xl": "text-4xl",
  "3xl": "text-3xl",
  "2xl": "text-2xl",
  xl: "text-xl",
  base: "text-base",
  sm: "text-sm",
};

export type FontSizes = keyof typeof fontSizes;

export const Headline = ({
  as = "h1",
  size = "3xl",
  children,
}: HeadlineProps) => {
  const Component = as;
  return (
    <Component
      className={twMerge(
        fontSizes[size],
        "semibold whitespace-pre-line text-center",
      )}
    >
      {children}
    </Component>
  );
};
