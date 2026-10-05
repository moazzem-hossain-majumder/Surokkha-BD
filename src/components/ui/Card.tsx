import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "interactive" | "elevated";
}

export function Card({ variant = "default", className = "", ...props }: CardProps) {
  let variantClass = "border-border bg-surface";

  if (variant === "glass") {
    variantClass = "glass-panel shadow-sm";
  } else if (variant === "interactive") {
    variantClass =
      "border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg";
  } else if (variant === "elevated") {
    variantClass = "border-border bg-surface shadow-md";
  }

  return (
    <div
      className={`rounded-card border transition-all duration-200 ${variantClass} ${className}`}
      {...props}
    />
  );
}
