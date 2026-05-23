import { useMemo, useState } from 'react';
import type { Catalogue, FieldDef, FieldType } from '../types';

interface Props {
  catalogue: Catalogue;
  setCatalogue: (c: Catalogue) => void;
  resetToSpec: () => void;
}

const FIELD_TYPES: FieldType[] = ['enum', 'multienum', 'number', 'boolean', 'text'];

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-slate-800 shadow-sm transition focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30';

export function ConfigEditor({ catalogue, setCatalogue, resetToSpec }: Props) {
  const [filter, setFilter] = useState('');

  const updateField = (code: string, patch: Partial<FieldDef>) => {
    setCatalogue({
      ...catalogue,
      fields: catalogue.fields.map((f) => (f.code === code ? { ...f, ...patch } : f)),
    });
  };

  const deleteField = (code: string) => {
    setCatalogue({ ...catalogue, fields: catalogue.fields.filter((f) => f.code !== code) });
  };

  const addField = () => {
    const code = `custom-${Date.now().toString().slice(-5)}`;
    setCatalogue({
      ...catalogue,
      fields: [
        ...catalogue.fields,
        { code, section: 'Custom fields', label: 'New field', type: 'text' },
      ],
    });
  };

  const filtered = useMemo(() => {
    const q = filter.toLowerCase().trim();
    if (!q) return catalogue.fields;
    return catalogue.fields.filter(
      (f) =>
        f.label.toLowerCase().includes(q) ||
        f.code.toLowerCase().includes(q) ||
        f.section.toLowerCase().includes(q),
    );
  }, [catalogue.fields, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          className={`${inputClass} max-w-xs`}
          placeholder="Filter by code, label or section…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button
          onClick={addField}
          className="rounded-full bg-[#0071e3] px-4 py-1.5 text-[13px] font-medium text-white shadow-sm transition hover:bg-[#0077ed]"
        >
          + Add field
        </button>
        <button
          onClick={resetToSpec}
          className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[13px] font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          Reset to RdSAP spec
        </button>
        <span className="text-[13px] text-slate-400">{filtered.length} fields</span>
      </div>

      <div className="space-y-3">
        {filtered.map((field) => (
          <div key={field.code} className="rounded-2xl border border-black/5 bg-white/80 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.1)] backdrop-blur-xl">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <label className="text-xs font-medium text-slate-500">
                Code
                <input
                  className={inputClass}
                  value={field.code}
                  onChange={(e) => updateField(field.code, { code: e.target.value })}
                />
              </label>
              <label className="text-xs font-medium text-slate-500">
                Section
                <input
                  className={inputClass}
                  value={field.section}
                  onChange={(e) => updateField(field.code, { section: e.target.value })}
                />
              </label>
              <label className="text-xs font-medium text-slate-500">
                Type
                <select
                  className={inputClass}
                  value={field.type}
                  onChange={(e) => updateField(field.code, { type: e.target.value as FieldType })}
                >
                  {FIELD_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="mt-3 block text-xs font-medium text-slate-500">
              Label
              <input
                className={inputClass}
                value={field.label}
                onChange={(e) => updateField(field.code, { label: e.target.value })}
              />
            </label>

            {(field.type === 'enum' || field.type === 'multienum') && (
              <label className="mt-3 block text-xs font-medium text-slate-500">
                Options (one per line)
                <textarea
                  className={`${inputClass} font-mono`}
                  rows={Math.min(10, (field.options?.length ?? 1) + 1)}
                  value={(field.options ?? []).join('\n')}
                  onChange={(e) =>
                    updateField(field.code, {
                      options: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                />
              </label>
            )}

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="text-xs font-medium text-slate-500">
                Guidance (shown to trainee)
                <textarea
                  className={inputClass}
                  rows={2}
                  value={field.guidance ?? ''}
                  onChange={(e) => updateField(field.code, { guidance: e.target.value })}
                />
              </label>
              <label className="text-xs font-medium text-slate-500">
                Model answer (optional — enables grading)
                <input
                  className={inputClass}
                  value={field.modelAnswer ?? ''}
                  onChange={(e) => updateField(field.code, { modelAnswer: e.target.value })}
                />
              </label>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={!!field.repeatable}
                  onChange={(e) => updateField(field.code, { repeatable: e.target.checked })}
                />
                Repeatable (per building part / wall / window)
              </label>
              <button
                onClick={() => deleteField(field.code)}
                className="rounded-full border border-red-200 px-4 py-1.5 text-[13px] font-medium text-red-500 transition hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
