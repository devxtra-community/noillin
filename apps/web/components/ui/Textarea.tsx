import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    helperText?: string;
    error?: string;
    maxLength?: number;
    value?: string | number | readonly string[] | undefined; // Explicitly define value to help TS
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, helperText, error, maxLength, ...props }, ref) => {
        // const currentLength = String(props.value || '').length;

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {label}
                    </label>
                )}
                <textarea
                    className={cn(
                        "flex min-h-30 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
                        error && "border-red-500 focus-visible:ring-red-500",
                        className
                    )}
                    ref={ref}
                    maxLength={maxLength}
                    {...props}
                />
                <div className="flex justify-between items-start mt-1.5">
                    {(helperText || error) && (
                        <p
                            className={cn(
                                "text-xs",
                                error ? "text-red-500" : "text-gray-400"
                            )}
                        >
                            {error || helperText}
                        </p>
                    )}
                    {maxLength !== undefined && (
                        <span className="text-xs text-gray-400">
                            Max {maxLength} lines recommended
                        </span>
                    )}
                </div>
            </div>
        );
    }
);
Textarea.displayName = "Textarea";

export { Textarea };
