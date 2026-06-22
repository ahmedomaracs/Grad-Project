import React from 'react';

export default function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F5] w-full max-w-[440px] mx-auto overflow-hidden relative">
      {/* Brand Icon */}
      <div className="absolute top-[306px] left-1/2 -translate-x-1/2 flex items-center justify-center w-[120px] h-[120px]">
        <div className="w-20 h-20 rounded-2xl bg-[#0F0F0F] flex items-center justify-center shadow-lg">
          <svg width="40" height="28" viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 20L8 8H32L36 20H4Z" fill="#E12F2F" />
            <rect x="2" y="20" width="36" height="6" rx="3" fill="#E12F2F" />
            <circle cx="10" cy="24" r="3" fill="#0F0F0F" />
            <circle cx="30" cy="24" r="3" fill="#0F0F0F" />
          </svg>
        </div>
      </div>

      {/* Automate Heading */}
      <div className="absolute top-[447px] left-1/2 -translate-x-1/2 text-center w-full">
        <h1 className="font-display text-[52px] leading-[52px] tracking-[1px] text-[#0F0F0F] uppercase">
          Automate
        </h1>
      </div>

      {/* Subtitle */}
      <div className="absolute top-[511px] left-1/2 -translate-x-1/2 text-center w-full px-8">
        <p className="font-sans text-[16px] font-medium leading-[26px] text-[#838383] tracking-normal">
          All Your Car Services in One Place
        </p>
      </div>

      {/* Pagination Dots */}
      <div className="absolute top-[585px] left-1/2 -translate-x-1/2 flex flex-row items-center gap-[8px] h-[12px]">
        <div className="w-[28px] h-[8px] bg-[#E12F2F] rounded-full" />
        <div className="w-[8px] h-[8px] bg-[#C2C2C2] rounded-full" />
        <div className="w-[8px] h-[8px] bg-[#C2C2C2] rounded-full" />
      </div>
    </div>
  );
}
