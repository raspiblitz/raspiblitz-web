import { type ButtonProps, Button as HeroUIButton } from "@heroui/react";
import type { ReactNode } from "react";

interface CustomButtonProps extends ButtonProps {
  children: ReactNode;
}

export const Button = ({ children, ...props }: CustomButtonProps) => (
  <HeroUIButton className="rounded-full px-8 py-6 font-semibold" {...props}>
    {children}
  </HeroUIButton>
);
