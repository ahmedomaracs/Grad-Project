'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../store/authStore';

export function Header() {
  const { user } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  return (
    <div className="flex flex-col border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.02)] w-full h-[72px] justify-center px-[16px] z-50">
      <div className="flex flex-row items-center justify-between w-full max-w-[1440px] mx-auto">
        
        {/* Left Side: Logo & Title */}
        <div className="flex flex-row items-center gap-[16px]">
          {/* Logo Box */}
          <Link href="/">
            <button className="flex flex-col p-[8px] rounded-[10px] bg-transparent hover:bg-slate-50 transition-colors cursor-pointer border border-slate-200">
              <div className="w-[24px] h-[24px] flex items-center justify-center">
                {/* Simplified Logo Icon */}
                <div className="grid grid-cols-2 gap-[2px]">
                   <div className="w-[10px] h-[10px] border border-slate-900" />
                   <div className="w-[10px] h-[10px] border border-slate-900" />
                   <div className="w-[10px] h-[10px] border border-slate-900" />
                </div>
              </div>
            </button>
          </Link>

          {/* Title with red divider */}
          <div className="flex flex-row items-center gap-[8px]">
            <div className="w-[2px] h-[24px] bg-[#E62424]" />
            <h2 className="text-slate-900 text-[20px] font-bold leading-[28px] font-sans">
              Automate Admin
            </h2>
          </div>
        </div>

        {/* Right Side: User Profile & Actions */}
        <div className="flex flex-row items-center gap-[16px]">
          {/* User Profile Badge */}
          {hydrated && user ? (
            <div className="flex flex-row items-center pl-[16px] pr-[4px] py-[4px] gap-[12px] border border-slate-200 rounded-full">
              <div className="flex flex-col">
                <span className="text-slate-900 text-[14px] font-bold leading-[20px] text-right font-sans">
                  {user.name}
                </span>
                <span className="text-slate-500 text-[12px] font-normal leading-[16px] text-right font-sans">
                  {user.role}
                </span>
              </div>
              <div className="w-[32px] h-[32px] flex flex-row justify-center items-center rounded-full bg-[#E62424] overflow-hidden">
                 {user.avatar ? (
                   <img src={user.avatar} alt={user.name} className="object-cover w-full h-full" />
                 ) : (
                   <span className="text-white text-[14px] font-bold font-sans uppercase">
                     {user.name.charAt(0)}
                   </span>
                 )}
              </div>
            </div>
          ) : (
            <div className="flex flex-row items-center pl-[16px] pr-[4px] py-[4px] gap-[12px] border border-slate-200 rounded-full">
              <div className="flex flex-col">
                <span className="text-slate-900 text-[14px] font-bold leading-[20px] text-right font-sans">
                  Loading...
                </span>
              </div>
            </div>
          )}
          
          {/* Settings/Notification Icon */}
          <button className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center bg-transparent hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer relative">
            <div className="w-[20px] h-[20px] border border-slate-900 rounded-full" />
            {/* Notification Dot */}
            <div className="absolute top-[8px] right-[8px] w-[8px] h-[8px] rounded-full bg-[#E62424]" />
          </button>
        </div>

      </div>
    </div>
  );
}
