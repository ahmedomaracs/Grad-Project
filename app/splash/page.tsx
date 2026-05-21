import React from 'react';

export default function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FAFB] w-full max-w-[440px] mx-auto overflow-hidden relative">
      {/* Automate Heading */}
      <div className="absolute top-[477px] left-1/2 -translate-x-1/2 text-center w-full">
        <h1 className="font-['Arimo'] text-[48px] font-bold leading-[48px] tracking-[1.2px] text-[#101828]">
          Automate
        </h1>
      </div>

      {/* Paragraph Subtitle */}
      <div className="absolute top-[541px] left-1/2 -translate-x-1/2 text-center w-full">
        <p className="font-['Arimo'] text-[18px] font-normal leading-[28px] text-[#4A5565] tracking-normal">
          All Your Car Services in One App
        </p>
      </div>

      {/* Loading/Pagination Indicator Container */}
      <div className="absolute top-[617px] left-1/2 -translate-x-1/2 flex flex-row items-center gap-[8px] h-[12px]">
        {/* Active Dot */}
        <div className="w-[12px] h-[12px] bg-[#E7000B] rounded-full" />
        {/* Inactive Dot */}
        <div className="w-[12px] h-[12px] bg-[#E5E7EB] rounded-full" />
        {/* Inactive Dot */}
        <div className="w-[12px] h-[12px] bg-[#E5E7EB] rounded-full" />
      </div>

      {/* Top Graphic/Icon Vector */}
      <div className="absolute top-[326px] left-1/2 -translate-x-1/2 flex items-center justify-center w-[120px] h-[120px]">
        <svg
          width="80"
          height="40"
          viewBox="0 0 80 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 20C0 8.95431 8.95431 0 20 0H60C71.0457 0 80 8.95431 80 20C80 31.0457 71.0457 40 60 40H20C8.95431 40 0 31.0457 0 20Z"
            fill="black"
          />
          <path
            d="M1 20C1 9.50659 9.50659 1 20 1H60C70.4934 1 79 9.50659 79 20C79 30.4934 70.4934 39 60 39H20C9.50659 39 1 30.4934 1 20Z"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}
