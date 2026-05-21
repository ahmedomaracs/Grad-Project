import React from 'react';

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
}

export function SocialButton({ icon, label, className = '', ...props }: SocialButtonProps) {
  return (
    <button
      type="button"
      className={`flex flex-1 justify-center items-center py-2.5 px-4 bg-white border border-gray-200 rounded-xl transition-all duration-200 hover:bg-gray-50 hover:-translate-y-[1px] shadow-sm gap-2 text-sm font-medium text-gray-700 ${className}`}
      {...props}
    >
      <div className="w-5 h-5 flex items-center justify-center">
        {icon}
      </div>
      {label && <span>{label}</span>}
    </button>
  );
}
