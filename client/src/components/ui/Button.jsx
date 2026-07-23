import React from 'react';
import { cn } from '../../lib/utils'; // wait, need to create utils.js

export function Button({ className, variant = 'primary', size = 'default', children, ...props }) {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'bg-text-primary text-bg-primary hover:bg-text-primary/90',
    secondary: 'bg-bg-secondary text-text-primary hover:bg-bg-secondary/80',
    outline: 'border border-border-color bg-transparent hover:bg-bg-secondary text-text-primary',
    ghost: 'hover:bg-bg-secondary hover:text-text-primary',
    link: 'text-accent underline-offset-4 hover:underline'
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3 text-sm',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10'
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
