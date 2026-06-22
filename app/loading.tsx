export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans text-ink">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-slate-200 border-t-brand rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Loading…
        </p>
      </div>
    </div>
  );
}
