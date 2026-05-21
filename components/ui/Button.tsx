'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[#FF2D2D] text-white hover:bg-[#e02626] shadow-[0_0_20px_rgba(255,45,45,0.3)] hover:shadow-[0_0_30px_rgba(255,45,45,0.5)] border border-[#FF2D2D]/50 relative overflow-hidden group',
        secondary:
          'bg-white/5 backdrop-blur-md text-gray-900 border border-gray-200/50 shadow-sm hover:bg-white/50 hover:shadow-md hover:border-gray-300/50',
        outline:
          'border border-gray-200 bg-transparent hover:bg-gray-100 text-gray-900',
        ghost: 'hover:bg-gray-100 hover:text-gray-900 text-gray-600',
        link: 'text-[#FF2D2D] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 rounded-lg px-3',
        lg: 'h-14 rounded-2xl px-8 text-base',
        icon: 'h-11 w-11',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props as any}
      >
        {props.children}
        {variant === 'default' && (
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
        )}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
