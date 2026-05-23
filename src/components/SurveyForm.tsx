import { useMemo } from 'react';
import type { Answers, AnswerValue, Catalogue, FieldDef } from '../types';
import { FieldInput } from './FieldInput';
import { RepeatableGroup } from './RepeatableGroup';
import { Guidance } from './Guidance';

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

export function SurveyForm({ catalogue, answers, setAnswer }: Props) {
  const sections = useMemo(() => groupBySection(catalogue.fields), [catalogue.fields]);

  return (
    <div className="space-y-8">
      {sections.map(([section, fields]) => (
        <section key={section} className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">{section}</h2>
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.code} className="grid grid-cols-1 gap-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start md:gap-4">
                <label className="pt-2 text-sm font-medium text-slate-700">
                  <span className="mr-2 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-500">
                    {field.code}
                  </span>
                  {field.label}
                  {field.repeatable && (
                    <span className="ml-1 text-xs font-normal text-slate-400">(per instance)</span>
                  )}
                  {field.guidance && <Guidance text={field.guidance} />}
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
