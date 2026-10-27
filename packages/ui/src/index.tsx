import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Brand Logo Component
export interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className,
  size = 'md',
  showSubtitle = true,
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn(
        'relative flex items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/20',
        iconSizes[size]
      )}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className={cn('font-bold tracking-tight text-slate-100 font-sans', textSizes[size])}>
          L&apos;s <span className="text-blue-500">-</span> Auth
        </span>
        {showSubtitle && (
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
            Liji Groups Identity
          </span>
        )}
      </div>
    </div>
  );
};

// Status Badge Component
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className,
  ...props
}) => {
  const variantStyles = {
    success: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/50',
    warning: 'bg-amber-950/80 text-amber-400 border-amber-800/50',
    error: 'bg-rose-950/80 text-rose-400 border-rose-800/50',
    info: 'bg-blue-950/80 text-blue-400 border-blue-800/50',
    neutral: 'bg-slate-800/80 text-slate-300 border-slate-700/50',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', {
        'bg-emerald-400': variant === 'success',
        'bg-amber-400': variant === 'warning',
        'bg-rose-400': variant === 'error',
        'bg-blue-400': variant === 'info',
        'bg-slate-400': variant === 'neutral',
      })} />
      {children}
    </span>
  );
};
