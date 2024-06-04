import ButtonSpinner from "./ButtonSpinner/ButtonSpinner";
import type { ButtonHTMLAttributes, FC, ReactElement } from "react";

type Props = {
  className?: string;
  loading?: boolean;
  icon?: ReactElement;
} & ButtonHTMLAttributes<unknown>;

const ButtonWithSpinner: FC<Props> = ({
  className,
  children,
  loading,
  disabled,
  onClick,
  icon,
  type,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      disabled={disabled || loading}
    >
      <div className="flex items-center justify-center">
        {loading && <ButtonSpinner />}
        {!loading && icon}
        {children}
      </div>
    </button>
  );
};

export default ButtonWithSpinner;
