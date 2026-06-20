'use client';

import React, { Suspense } from 'react';
import { WorkspaceLayout } from '../../../components/dashboard/WorkspaceLayout';
import { EnquiryForm } from '../../../components/sections/EnquiryForm';
import { Loader2 } from 'lucide-react';

function BookQuoteContent() {
  return (
    <div className="space-y-6">
      <EnquiryForm />
    </div>
  );
}

export default function BookQuotePage() {
  return (
    <WorkspaceLayout>
      <Suspense fallback={
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#E62424] mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading booking workspace...</p>
        </div>
      }>
        <BookQuoteContent />
      </Suspense>
    </WorkspaceLayout>
  );
}
