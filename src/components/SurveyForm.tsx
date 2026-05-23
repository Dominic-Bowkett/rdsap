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
      <div className="sticky top-[73px] z-10 -mx-1 rounded-xl border-2 border-neutral-900 bg-white px-5 py-3 shadow-sm">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-neutral-900">Progress</span>
          <span className="tabular-nums font-semibold text-neutral-600">
            {answered} / {visible.length} relevant fields
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full rounded-full bg-yellow-400 transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {sections.map(([section, fields]) => (
        <section
          key={section}
          className="overflow-hidden rounded-xl border-2 border-neutral-900 bg-white shadow-[4px_4px_0_0_rgba(250,204,21,1)]"
        >
          <h2 className="border-b-4 border-yellow-400 bg-neutral-950 px-6 py-3 text-[15px] font-bold tracking-tight text-white">
            {section}
          </h2>
          <div className="divide-y divide-neutral-200">
            {fields.map((field) => (
              <div
                key={field.code}
                className="grid grid-cols-1 gap-2 px-6 py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-6"
              >
                <label className="flex items-start text-[13px] font-semibold text-neutral-800">
                  <span className="mr-2 mt-0.5 rounded-md bg-yellow-400 px-1.5 py-0.5 font-mono text-[11px] font-bold text-black">
                    {field.code}
                  </span>
                  <span>
                    {field.label}
                    {field.repeatable && (
                      <span className="ml-1 text-[11px] font-normal text-neutral-400">(per instance)</span>
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
