import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 font-sans text-ink">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_#E62424_0%,_transparent_65%)] opacity-[0.04] blur-[100px]" />
      </div>

      <div className="relative z-10 text-center max-w-md">
        <p className="text-[10px] font-black uppercase tracking-widest text-brand mb-4">
          Error 404
        </p>
        <h1 className="font-display text-6xl sm:text-7xl text-ink mb-4">
          PAGE NOT FOUND
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          The route you requested doesn&apos;t exist or has been moved.
          Double-check the URL or head back to the homepage.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-7 h-12 bg-brand hover:bg-brand-dark text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-brand/20"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
