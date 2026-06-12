import React from 'react';
import Link from 'next/link';

interface LogoProps {
  showText?: boolean;
  className?: string;
}

export function Logo({ showText = true, className = '' }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      <div className="w-9 h-9 flex-shrink-0 drop-shadow-md transition-transform duration-300 group-hover:scale-105">
        <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gearGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E62424" />
              <stop offset="100%" stopColor="#A01515" />
            </linearGradient>
          </defs>
          
          {/* Gear Shape: 6-lobed scalloped gear */}
          <path
            fill="url(#gearGradient)"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinejoin="round"
            d="M 50 4
               C 56 4, 59 7, 61 12
               C 66 11, 72 13, 76 18
               C 80 23, 80 29, 78 34
               C 83 38, 86 44, 86 50
               C 86 56, 83 62, 78 66
               C 80 71, 80 77, 76 82
               C 72 87, 66 89, 61 88
               C 59 93, 56 96, 50 96
               C 44 96, 41 93, 39 88
               C 34 89, 28 87, 24 82
               C 20 77, 20 71, 22 66
               C 17 62, 14 56, 14 50
               C 14 44, 17 38, 22 34
               C 20 29, 20 23, 24 18
               C 28 13, 34 11, 39 12
               C 41 7, 44 4, 50 4 Z"
          />
          
          {/* Car Silhouette: single minimalist white stroke path with side mirrors and wheels */}
          <path
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M 28 65
               L 28 58
               C 28 54, 30 52, 34 52
               L 36 44
               C 38 38, 44 35, 50 35
               C 56 35, 62 38, 64 44
               L 66 52
               C 70 52, 72 54, 72 58
               L 72 65
               M 32 52 L 28 52 M 68 52 L 72 52
               M 34 65 A 6 6 0 1 1 46 65
               M 46 65 L 54 65
               M 54 65 A 6 6 0 1 1 66 65"
          />
        </svg>
      </div>
      
      {showText && (
        <span className="font-sans font-bold tracking-tight text-slate-900 text-xl md:text-2xl transition-colors duration-300 group-hover:text-[#E62424]">
          Automate
        </span>
      )}
    </Link>
  );
}

export default Logo;
