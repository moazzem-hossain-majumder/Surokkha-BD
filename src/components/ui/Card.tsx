import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "interactive";
}

export function Card({ variant = "default", className = "", ...props }: CardProps) {
  let variantClass = "border-border bg-surface";

  if (variant === "interactive") {
    variantClass =
      "border-border bg-surface transition-colors duration-150 ease-out hover:bg-surface-2 hover:border-ink-3/40";
  }

  return (
    <div
      className={`rounded-card border transition-colors duration-150 ease-out ${variantClass} ${className}`}
      {...props}
    />
  );
}
