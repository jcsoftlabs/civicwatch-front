import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface SharedProps {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

type ButtonProps =
  | (SharedProps &
      ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
  | (SharedProps & { href: string });

const styles: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-white shadow-panel hover:bg-slate focus-visible:ring-brand/30",
  secondary:
    "border border-line bg-white text-slate hover:border-brand/30 hover:text-brand focus-visible:ring-brand/20",
  ghost:
    "bg-white/10 text-white hover:bg-white/20 focus-visible:ring-white/20",
  danger:
    "bg-critical text-white hover:bg-red-700 focus-visible:ring-critical/30"
};

const baseClassName =
  "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4";

export function Button(props: ButtonProps) {
  const { children, variant = "primary", className } = props;

  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href}
        className={cn(baseClassName, styles[variant], className)}
      >
        {children}
      </Link>
    );
  }

  const buttonProps = props as SharedProps & ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button
      {...buttonProps}
      className={cn(baseClassName, styles[variant], className)}
      type={buttonProps.type ?? "button"}
    >
      {children}
    </button>
  );
}
