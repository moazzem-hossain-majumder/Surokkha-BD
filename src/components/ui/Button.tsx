import { forwardRef } from "react";
import { Link } from "@/i18n/navigation";

type Variant = "primary" | "secondary" | "ghost" | "emergency";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-brand-ink hover:brightness-95",
  secondary: "border border-border bg-surface text-ink hover:bg-surface-2",
  ghost: "text-ink-2 hover:text-ink hover:bg-surface-2",
  emergency: "bg-sun text-white hover:brightness-95",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonAsLink = CommonProps & {
  href: string;
  locale?: "en" | "bn";
};

export const Button = forwardRef<HTMLButtonElement, ButtonAsButton>(
  ({ variant = "primary", size = "md", className = "", ...props }, ref) => (
    <button ref={ref} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
  )
);
Button.displayName = "Button";

export function LinkButton({
  variant = "primary",
  size = "md",
  className = "",
  href,
  locale,
  children,
  ...rest
}: ButtonAsLink & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return (
    <Link href={href} locale={locale} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </Link>
  );
}
