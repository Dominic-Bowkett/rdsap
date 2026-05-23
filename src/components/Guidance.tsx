import { useState } from 'react';

export function Guidance({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block align-middle">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="ml-1.5 inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-neutral-900 text-[11px] font-bold text-yellow-400 transition hover:bg-yellow-400 hover:text-black"
        aria-label="Show guidance"
        title="Show guidance"
      >
        ?
      </button>
      {open && (
        <span className="absolute left-6 top-0 z-20 w-72 rounded-xl border-2 border-neutral-900 bg-white p-3.5 text-[13px] font-normal leading-relaxed text-neutral-700 shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
}
