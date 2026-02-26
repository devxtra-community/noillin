import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';
// Importing React Icons for defaults if not provided, but allowing overrides
// For now, I will use text or passed in icons.

export interface SelectButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    selected?: boolean;
    label: string;
    icon?: React.ReactNode;
}

const SelectButton = forwardRef<HTMLButtonElement, SelectButtonProps>(
    ({ className, selected, label, icon, ...props }, ref) => {
        return (
            <button
                type="button"
                className={cn(
                    "flex items-center justify-center gap-2 w-full px-4 py-3 rounded-md border text-sm font-medium transition-colors",
                    selected
                        ? "border-green-400 bg-green-50 text-green-700"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
                    className
                )}
                ref={ref}
                {...props}
            >
                {icon && <span className="text-lg">{icon}</span>}
                {label}
            </button>
        );
    }
);
SelectButton.displayName = "SelectButton";

export { SelectButton };
