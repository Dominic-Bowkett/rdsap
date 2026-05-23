import type { AnswerValue, FieldDef } from '../types';
import { FieldInput } from './FieldInput';

interface Props {
  field: FieldDef;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
}

// A repeatable field holds an array of scalar answers (one per building part / wall / window).
export function RepeatableGroup({ field, value, onChange }: Props) {
  const items: AnswerValue[] = Array.isArray(value) ? (value as AnswerValue[]) : [];
  const scalar: FieldDef = { ...field, repeatable: false };

  const update = (index: number, v: AnswerValue) => {
    const next = [...items];
    next[index] = v;
    onChange(next as string[]);
  };
  const add = () => onChange([...items, ''] as string[]);
  const remove = (index: number) =>
    onChange(items.filter((_, i) => i !== index) as string[]);

  return (
    <div className="space-y-2">
      {items.length === 0 && (
        <p className="text-sm italic text-slate-400">No instances yet.</p>
      )}
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-8 shrink-0 text-[11px] font-medium text-slate-400">#{i + 1}</span>
          <div className="flex-1">
            <FieldInput field={scalar} value={item} onChange={(v) => update(i, v)} />
          </div>
          <button
            type="button"
            onClick={() => remove(i)}
            className="rounded-full p-1.5 text-neutral-400 transition hover:bg-red-50 hover:text-red-500"
            aria-label="Remove instance"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1 rounded-lg border-2 border-neutral-900 bg-yellow-400 px-3.5 py-1.5 text-[13px] font-bold text-black transition hover:bg-yellow-300"
      >
        + Add instance
      </button>
    </div>
  );
}
