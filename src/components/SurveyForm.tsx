import { useMemo } from 'react';
import type { Answers, AnswerValue, Catalogue, FieldDef } from '../types';
import { FieldInput } from './FieldInput';
import { RepeatableGroup } from './RepeatableGroup';
import { Guidance } from './Guidance';
import { visibleFields } from '../visibility';

interface Props {
  catalogue: Catalogue;
  answers: Answers;
  setAnswer: (code: string, value: AnswerValue) => void;
}

function groupBySection(fields: FieldDef[]): [string, FieldDef[]][] {
  const map = new Map<string, FieldDef[]>();
  for (const f of fields) {
    if (!map.has(f.section)) map.set(f.section, []);
    map.get(f.section)!.push(f);
  }
  return [...map.entries()];
}

function isAnswered(value: AnswerValue | undefined): boolean {
  if (value === undefined || value === '') return false;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export function SurveyForm({ catalogue, answers, setAnswer }: Props) {
  const visible = useMemo(() => visibleFields(catalogue.fields, answers), [catalogue.fields, answers]);
  const sections = useMemo(() => groupBySection(visible), [visible]);

  const answered = visible.filter((f) => isAnswered(answers[f.code])).length;
  const pct = visible.length ? Math.round((answered / visible.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="sticky top-[73px] z-10 -mx-1 rounded-2xl border border-black/5 bg-white/70 px-5 py-3 shadow-sm backdrop-blur-xl">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">Progress</span>
          <span className="tabular-nums text-slate-500">
            {answered} / {visible.length} relevant fields
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/70">
          <div
            className="h-full rounded-full bg-[#0071e3] transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {sections.map(([section, fields]) => (
        <section
          key={section}
          className="overflow-hidden rounded-3xl border border-black/5 bg-white/80 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-12px_rgba(0,0,0,0.12)] backdrop-blur-xl"
        >
          <h2 className="border-b border-slate-100 px-6 py-4 text-[15px] font-semibold tracking-tight text-slate-900">
            {section}
          </h2>
          <div className="divide-y divide-slate-100">
            {fields.map((field) => (
              <div
                key={field.code}
                className="grid grid-cols-1 gap-2 px-6 py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-6"
              >
                <label className="flex items-start text-[13px] font-medium text-slate-700">
                  <span className="mr-2 mt-0.5 rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-400">
                    {field.code}
                  </span>
                  <span>
                    {field.label}
                    {field.repeatable && (
                      <span className="ml-1 text-[11px] font-normal text-slate-400">(per instance)</span>
                    )}
                    {field.guidance && <Guidance text={field.guidance} />}
                  </span>
                </label>
                <div>
                  {field.repeatable ? (
                    <RepeatableGroup
                      field={field}
                      value={answers[field.code]}
                      onChange={(v) => setAnswer(field.code, v)}
                    />
                  ) : (
                    <FieldInput
                      field={field}
                      value={answers[field.code]}
                      onChange={(v) => setAnswer(field.code, v)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
