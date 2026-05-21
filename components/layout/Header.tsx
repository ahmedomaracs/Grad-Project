import React from 'react';

export function Header() {
  return (
    <div className="flex flex-col border-b border-[#1E2939] bg-[#101828] w-full h-[72px] justify-center px-[16px]">
      <div className="flex flex-row items-center justify-between w-full max-w-[1440px] mx-auto">
        
        {/* Left Side: Logo & Title */}
        <div className="flex flex-row items-center gap-[16px]">
          {/* Logo Box */}
          <button className="flex flex-col p-[8px] rounded-[10px] bg-transparent hover:bg-[#1E2939] transition-colors cursor-pointer border border-[#364153]">
            <div className="w-[24px] h-[24px] flex items-center justify-center">
              {/* Simplified Logo Icon */}
              <div className="grid grid-cols-2 gap-[2px]">
                 <div className="w-[10px] h-[10px] border border-white" />
                 <div className="w-[10px] h-[10px] border border-white" />
                 <div className="w-[10px] h-[10px] border border-white" />
              </div>
            </div>
          </button>

          {/* Title with red divider */}
          <div className="flex flex-row items-center gap-[8px]">
            <div className="w-[2px] h-[24px] bg-[#FB2C36]" />
            <h2 className="text-white text-[20px] font-bold leading-[28px] font-['Arimo']">
              Automate Admin
            </h2>
          </div>
        </div>

        {/* Right Side: User Profile & Actions */}
        <div className="flex flex-row items-center gap-[16px]">
          {/* User Profile Badge */}
          <div className="flex flex-row items-center pl-[16px] pr-[4px] py-[4px] gap-[12px] border border-[#364153] rounded-[33554400px]">
            <div className="flex flex-col">
              <span className="text-white text-[14px] font-bold leading-[20px] text-right font-['Arimo']">
                vhbjklnm
              </span>
              <span className="text-[#99A1AF] text-[12px] font-normal leading-[16px] text-right font-['Arimo']">
                Administrator
              </span>
            </div>
            <div className="w-[32px] h-[32px] flex flex-row justify-center items-center rounded-full bg-[#E7000B]">
               <span className="text-white text-[14px] font-bold font-['Arimo']">V</span>
            </div>
          </div>
          
          {/* Settings/Notification Icon */}
          <button className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center bg-transparent hover:bg-[#1E2939] border border-[#364153] transition-colors cursor-pointer relative">
            <div className="w-[20px] h-[20px] border border-white rounded-full" />
            {/* Notification Dot */}
            <div className="absolute top-[8px] right-[8px] w-[8px] h-[8px] rounded-full bg-[#E7000B]" />
          </button>
        </div>

      </div>
    </div>
  );
}
