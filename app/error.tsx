'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    // e.g., Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 font-sans text-ink">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_#E62424_0%,_transparent_65%)] opacity-[0.04] blur-[100px]" />
      </div>

      <div className="relative z-10 text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 bg-red-50 border border-red-200/50 rounded-2xl flex items-center justify-center">
          <span className="text-3xl">⚠️</span>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-brand mb-4">
          Something Went Wrong
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-ink mb-4">
          UNEXPECTED ERROR
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          We encountered an issue while loading this page. Please try again
          or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-7 h-12 bg-brand hover:bg-brand-dark text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-brand/20 cursor-pointer"
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-7 h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
