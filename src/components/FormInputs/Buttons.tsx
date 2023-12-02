import { ReactNode, FC, ButtonHTMLAttributes } from "react";
import classNames from "classnames";

export const buttonClassname =
  "inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold " +
  "shadow-sm focus-visible:outline focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 border-2 border-orange-700";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}
export const PrimaryButton: FC<ButtonProps> = ({
  children,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={classNames(
        buttonClassname,
        "bg-orange-700 hover:bg-orange-600 hover:border-orange-600 text-white focus-visible:outline-orange-600",
        className,
        disabled ? "pointer-events-none opacity-50" : ""
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const SecondaryButton: FC<ButtonProps> = ({
  children,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={classNames(
        buttonClassname,
        className,
        disabled ? "pointer-events-none opacity-50" : "",
        "bg-white focus-visible:outline-orange-600 text-orange-700"
      )}
      {...props}
    >
      {children}
    </button>
  );
};

interface LinkTextProps {
  text: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}
export const LinkText: FC<LinkTextProps> = ({ text, disabled, className, onClick }) => {
  return (
    <span
      onClick={onClick}
      className={classNames(
        "text-red-400 focus:outline-none font-semibold bg-transparent p-0",
        disabled
          ? "opacity-50 pointer-events-none"
          : "hover:underline hover:cursor-pointer",
        className
      )}
    >
      {text}
    </span>
  );
};
