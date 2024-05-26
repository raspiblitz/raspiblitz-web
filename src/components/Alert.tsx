import type { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export interface Props extends HTMLAttributes<HTMLElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
  children: ReactNode;
  color?: Colors;
}

const colors = {
  success: "text-success border-success bg-green-900",
  warning: "text-warning border-warning bg-red-900",
  danger: "text-danger border-danger bg-yellow-900",
};

type Colors = keyof typeof colors;

export const Alert = ({ as = "p", color = "success", children }: Props) => {
  const Component = as;

  return (
    <Component
      className={twMerge(
        "rounded-xl border p-4 text-center font-semibold",
        colors[color],
      )}
    >
      {children}
    </Component>
  );
};
