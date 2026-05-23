import type { AnswerValue, FieldDef } from '../types';

interface Props {
  field: FieldDef;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
}

const inputClass =
  'w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500';

export function FieldInput({ field, value, onChange }: Props) {
  switch (field.type) {
    case 'enum':
      return (
        <select
          className={inputClass}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">— select —</option>
          {(field.options ?? []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );

    case 'multienum': {
      const selected = Array.isArray(value) ? (value as string[]) : [];
      const toggle = (opt: string) =>
        onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
      return (
        <div className="flex flex-wrap gap-2">
          {(field.options ?? []).map((opt) => (
            <label key={opt} className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      );
    }

    case 'number':
      return (
        <div className="flex items-center gap-2">
          <input
            type="number"
            className={inputClass}
            value={value === undefined || value === '' ? '' : (value as number)}
            onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          />
          {field.unit && <span className="text-sm text-slate-500">{field.unit}</span>}
        </div>
      );

    case 'boolean':
      return (
        <select
          className={inputClass}
          value={value === undefined ? '' : value ? 'yes' : 'no'}
          onChange={(e) => onChange(e.target.value === 'yes')}
        >
          <option value="">— select —</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      );

    case 'text':
      return (
        <input
          type="text"
          className={inputClass}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}
