import { forwardRef } from "react";
import { Link } from "@/i18n/navigation";

type Variant = "primary" | "secondary" | "ghost" | "emergency";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-offset-2 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-brand-ink shadow-sm hover:shadow-md hover:bg-brand/90 hover:brightness-105",
  secondary: "border border-border bg-surface text-ink shadow-2xs hover:bg-surface-2 hover:border-brand/30 hover:shadow-xs",
  ghost: "text-ink-2 hover:text-ink hover:bg-surface-2",
  emergency: "bg-sun text-white shadow-sm hover:shadow-md hover:bg-sun/90 hover:brightness-105 ring-2 ring-sun/30",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
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
