import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
}

export function Input({ icon, label, className = '', id, ...props }: InputProps) {
  const inputId = id || props.name;

  return (
    <div className={`flex flex-col w-full space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3.5 flex items-center text-muted pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full py-2.5 bg-white border border-ink/15 text-ink rounded-lg transition-colors duration-200 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
            icon ? 'pl-11 pr-4' : 'px-4'
          }`}
          {...props}
        />
      </div>
    </div>
  );
}
