import React from 'react';

export function AdminDashboardContent() {
  return (
    <div className="flex flex-col flex-1 bg-[#F9FAFB] min-h-screen">
      <div className="flex flex-col pt-[16px] px-[16px] gap-[32px] w-full max-w-[1440px] mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col gap-[8px]">
          <h1 className="text-[#101828] text-[30px] font-bold leading-[36px] font-['Arimo']">
            Admin Dashboard
          </h1>
          <p className="text-[#4A5565] text-[16px] font-normal leading-[24px] font-['Arimo']">
            Manage and monitor the entire platform
          </p>
        </div>

        {/* Analytics & Reports Card */}
        <div className="flex flex-col p-[32px] gap-[24px] rounded-[16px] bg-white border border-[#E5E7EB] shadow-sm">
          <div className="flex flex-row">
            <h2 className="text-[#101828] text-[20px] font-bold leading-[28px] font-['Arimo']">
              Analytics & Reports
            </h2>
          </div>
          <p className="text-[#4A5565] text-[16px] font-normal leading-[24px] font-['Arimo'] max-w-[600px]">
            Advanced analytics, charts, and report generation tools will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
}
