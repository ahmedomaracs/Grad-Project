import React from 'react';

export function Sidebar() {
  return (
    <div className="flex flex-col w-[250px] min-h-screen bg-[#101828] border-r border-[#1E2939]">
      <div className="flex flex-col flex-1">
        {/* Main Navigation Links */}
        <div className="flex flex-col pt-[24px] px-[16px] gap-[8px]">
          {/* Overview */}
          <button className="flex flex-row items-center px-[16px] py-[12px] gap-[12px] rounded-[14px] hover:bg-[#1E2939] transition-colors cursor-pointer w-full text-left">
            <div className="w-[20px] h-[20px] flex items-center justify-center">
              {/* Icon Placeholder */}
              <div className="grid grid-cols-2 gap-[2px]">
                <div className="w-[8px] h-[8px] border border-[#99A1AF]" />
                <div className="w-[8px] h-[8px] border border-[#99A1AF]" />
                <div className="w-[8px] h-[8px] border border-[#99A1AF]" />
                <div className="w-[8px] h-[8px] border border-[#99A1AF]" />
              </div>
            </div>
            <p className="text-[#99A1AF] text-[16px] font-bold leading-[24px] font-['Arimo']">
              Overview
            </p>
          </button>

          {/* Users */}
          <button className="flex flex-row items-center px-[16px] py-[12px] gap-[12px] rounded-[14px] hover:bg-[#1E2939] transition-colors cursor-pointer w-full text-left">
            <div className="w-[20px] h-[20px] flex items-center justify-center">
               <div className="flex flex-col gap-[2px]">
                <div className="w-[14px] h-[4px] border border-[#99A1AF] rounded-full mx-auto" />
                <div className="w-[18px] h-[10px] border border-[#99A1AF] rounded-t-full" />
              </div>
            </div>
            <p className="text-[#99A1AF] text-[16px] font-bold leading-[24px] font-['Arimo']">
              Users
            </p>
          </button>

          {/* Products */}
          <button className="flex flex-row items-center px-[16px] py-[12px] gap-[12px] rounded-[14px] hover:bg-[#1E2939] transition-colors cursor-pointer w-full text-left">
            <div className="w-[20px] h-[20px] flex items-center justify-center">
               <div className="w-[16px] h-[16px] border border-[#99A1AF] flex items-center justify-center">
                 <div className="w-[8px] h-[8px] border border-[#99A1AF]" />
               </div>
            </div>
            <p className="text-[#99A1AF] text-[16px] font-bold leading-[24px] font-['Arimo']">
              Products
            </p>
          </button>

          {/* Bookings */}
          <button className="flex flex-row items-center px-[16px] py-[12px] gap-[12px] rounded-[14px] hover:bg-[#1E2939] transition-colors cursor-pointer w-full text-left">
             <div className="w-[20px] h-[20px] flex items-center justify-center">
               <div className="w-[16px] h-[16px] border border-[#99A1AF] rounded-sm relative">
                 <div className="absolute top-0 left-0 right-0 h-[4px] border-b border-[#99A1AF]" />
               </div>
            </div>
            <p className="text-[#99A1AF] text-[16px] font-bold leading-[24px] font-['Arimo']">
              Bookings
            </p>
          </button>

          {/* Analytics (Active) */}
          <button className="flex flex-row items-center px-[16px] py-[12px] gap-[12px] rounded-[14px] bg-[#E7000B] cursor-pointer w-full text-left">
            <div className="w-[20px] h-[20px] flex items-end justify-center gap-[2px]">
              <div className="w-[4px] h-[8px] border border-white bg-white" />
              <div className="w-[4px] h-[16px] border border-white bg-white" />
              <div className="w-[4px] h-[12px] border border-white bg-white" />
            </div>
            <p className="text-white text-[16px] font-bold leading-[24px] font-['Arimo']">
              Analytics
            </p>
          </button>
        </div>

        {/* Spacer to push Logout to bottom if needed, but per Figma it's a border top block */}
        <div className="mt-auto" />
        
        {/* Logout Section */}
        <div className="pt-[17px] px-[16px] pb-[24px] border-t border-[#1E2939]">
          <button className="flex flex-row items-center px-[16px] py-[12px] gap-[12px] rounded-[14px] hover:bg-[#1E2939] transition-colors cursor-pointer w-full text-left group">
            <div className="w-[20px] h-[20px] flex items-center justify-center relative">
               <div className="w-[12px] h-[16px] border border-[#FF6467] border-r-0 rounded-l-md" />
               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[10px] h-[2px] bg-[#FF6467]" />
               <div className="absolute right-[-2px] top-1/2 -translate-y-1/2 w-[6px] h-[6px] border-t border-r border-[#FF6467] rotate-45" />
            </div>
            <p className="text-[#FF6467] text-[16px] font-bold leading-[24px] font-['Arimo'] group-hover:text-red-400">
              Logout
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
