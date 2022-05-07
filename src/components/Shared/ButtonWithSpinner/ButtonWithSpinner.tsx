import type { ButtonHTMLAttributes, FC } from "react";
import ButtonSpinner from "./ButtonSpinner/ButtonSpinner";

type Props = {
  className?: string;
  loading?: boolean;
  icon?: React.ReactElement;
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
      <div className="flex">
        {loading && <ButtonSpinner />}
        {!loading && icon}
        {children}
      </div>
    </button>
  );
};

export default ButtonWithSpinner;
