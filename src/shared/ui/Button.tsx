import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClassName: Record<ButtonVariant, string> = {
  primary: "button button--primary",
  secondary: "button button--secondary",
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  const classes = [variantClassName[variant], className].filter(Boolean).join(" ");
  return <button className={classes} {...props} />;
}
