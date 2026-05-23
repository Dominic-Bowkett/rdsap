import { useState } from 'react';

export function Guidance({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block align-middle">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="ml-1 h-5 w-5 rounded-full border border-slate-300 text-xs font-bold text-slate-500 hover:bg-slate-100"
        aria-label="Show guidance"
        title="Show guidance"
      >
        ?
      </button>
      {open && (
        <span className="absolute left-6 top-0 z-10 w-72 rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
}
