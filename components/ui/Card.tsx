import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full max-w-md mx-auto ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
