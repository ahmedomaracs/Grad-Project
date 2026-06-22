import React from 'react';
import Link from 'next/link';

interface LogoProps {
  showText?: boolean;
  /** Use light (white) wordmark text for dark backgrounds */
  light?: boolean;
  className?: string;
}

export function Logo({ showText = true, light = false, className = '' }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 select-none group cursor-pointer ${className}`}>
      <img
        src="/assets/automate/logo-mark.png"
        alt="Automate"
        width={44}
        height={26}
        className="h-6 w-auto md:h-7 flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
      />

      {showText && (
        <span
          className={`font-display text-2xl md:text-3xl leading-none tracking-wide transition-colors duration-300 ${
            light ? 'text-white' : 'text-ink'
          }`}
        >
          AUTO<span className="text-brand">MATE</span>
        </span>
      )}
    </Link>
  );
}

export default Logo;
