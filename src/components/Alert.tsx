import type { HTMLAttributes, ReactNode } from "react";

export interface Props extends HTMLAttributes<HTMLElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
  children: ReactNode;
}

export const Alert = ({ as = "p", children }: Props) => {
  const Component = as;
  return (
    <Component className="rounded-xl border border-warning bg-yellow-900 p-4 text-center font-semibold text-warning">
      {children}
    </Component>
  );
};
