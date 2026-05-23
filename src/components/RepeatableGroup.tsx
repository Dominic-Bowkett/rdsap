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
          <span className="w-16 shrink-0 text-xs text-slate-500">#{i + 1}</span>
          <div className="flex-1">
            <FieldInput field={scalar} value={item} onChange={(v) => update(i, v)} />
          </div>
          <button
            type="button"
            onClick={() => remove(i)}
            className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="rounded-md border border-sky-300 bg-sky-50 px-3 py-1 text-sm text-sky-700 hover:bg-sky-100"
      >
        + Add instance
      </button>
    </div>
  );
}
