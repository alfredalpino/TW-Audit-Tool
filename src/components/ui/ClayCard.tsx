import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ClayCardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  light?: boolean;
  as?: "div" | "article" | "section";
}

export function ClayCard({
  children,
  className,
  hover = false,
  light = false,
  as: Tag = "div",
  ...rest
}: ClayCardProps) {
  return (
    <Tag
      className={cn(
        "tw-clay-card",
        hover && "tw-clay-card--hover",
        light && "tw-clay-card--light",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
