import React from 'react';
import { cn } from '@/lib/cn';

export interface ClayCardProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  /** Enable subtle lift on hover */
  hover?: boolean;
  /** Light-surface variant for plans / legacy sections */
  light?: boolean;
  as?: 'div' | 'article' | 'section';
}

export function ClayCard({
  children,
  className,
  hover = false,
  light = false,
  as: Tag = 'div',
  ...rest
}: ClayCardProps) {
  return (
    <Tag
      className={cn(
        'tw-clay-card',
        hover && 'tw-clay-card--hover',
        light && 'tw-clay-card--light',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default ClayCard;
