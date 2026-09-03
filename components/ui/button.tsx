import { ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-ink text-text-on-ink hover:bg-ink/90 dark:bg-brass dark:text-ink dark:hover:bg-brass-soft",
  secondary:
    "bg-transparent border border-ink-line text-text-strong hover:border-brass hover:bg-paper-raised dark:text-text-on-ink dark:hover:bg-ink-raised",
  ghost:
    "bg-transparent text-text-strong hover:text-garnet dark:text-text-on-ink dark:hover:text-brass",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-sm px-4 py-2 rounded-full",
  md: "text-sm px-5 py-3 rounded-full",
  lg: "text-base px-7 py-3.5 rounded-full",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}

export const LinkButton = forwardRef<
  HTMLAnchorElement,
  CommonProps & { href: string; children: React.ReactNode }
>(function LinkButton(
  { variant = "primary", size = "md", className, href, children },
  ref
) {
  return (
    <Link
      ref={ref}
      href={href}
      className={clsx(
        "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-200",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </Link>
  );
});
