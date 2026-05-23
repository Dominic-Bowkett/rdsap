import { useState } from 'react';

export function Guidance({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block align-middle">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="ml-1.5 inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-slate-200/80 text-[11px] font-semibold text-slate-500 transition hover:bg-[#0071e3] hover:text-white"
        aria-label="Show guidance"
        title="Show guidance"
      >
        ?
      </button>
      {open && (
        <span className="absolute left-6 top-0 z-20 w-72 rounded-2xl border border-black/5 bg-white/90 p-3.5 text-[13px] font-normal leading-relaxed text-slate-600 shadow-xl backdrop-blur-xl">
          {text}
        </span>
      )}
    </span>
  );
}
