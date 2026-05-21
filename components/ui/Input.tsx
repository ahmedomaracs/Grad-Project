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
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3.5 flex items-center text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full py-2.5 bg-white border border-gray-200 text-gray-900 rounded-xl transition-colors duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EF4444]/20 focus:border-[#EF4444] ${
            icon ? 'pl-11 pr-4' : 'px-4'
          }`}
          {...props}
        />
      </div>
    </div>
  );
}
