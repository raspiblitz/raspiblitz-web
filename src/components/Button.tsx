import { type ButtonProps, Button as NextUIButton } from "@nextui-org/react";
import type { ReactNode } from "react";

interface CustomButtonProps extends ButtonProps {
	children: ReactNode;
}

export const Button = ({ children, ...props }: CustomButtonProps) => (
	<NextUIButton radius="full" className="px-8 py-6 font-semibold" {...props}>
		{children}
	</NextUIButton>
);
