import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils'; // Assuming basic utils exists, standard in Next.js projects

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  rightElement?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, helperText, error, rightElement, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            className={cn(
              "flex h-12 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500 focus-visible:ring-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              {rightElement}
            </div>
          )}
        </div>
        {(helperText || error) && (
          <p
            className={cn(
              "text-xs mt-1.5",
              error ? "text-red-500" : "text-gray-500"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
