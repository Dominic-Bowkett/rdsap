import { useMemo } from 'react';
import type { Answers, AnswerValue, Catalogue, FieldDef } from '../types';
import { visibleFields } from '../visibility';

interface Props {
  catalogue: Catalogue;
  answers: Answers;
}

function displayValue(value: AnswerValue | undefined): string {
  if (value === undefined || value === '') return '(blank)';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.length ? value.join(', ') : '(blank)';
  return String(value);
}

function isCorrect(field: FieldDef, value: AnswerValue | undefined): boolean {
  const expected = (field.modelAnswer ?? '').trim().toLowerCase();
  return displayValue(value).trim().toLowerCase() === expected;
}

export function ReviewPanel({ catalogue, answers }: Props) {
  // Only assess fields that are currently relevant (visible) for these answers.
  const relevant = useMemo(() => visibleFields(catalogue.fields, answers), [catalogue.fields, answers]);
  const graded = useMemo(() => relevant.filter((f) => (f.modelAnswer ?? '').trim() !== ''), [relevant]);

  const answeredCount = relevant.filter(
    (f) => answers[f.code] !== undefined && answers[f.code] !== '',
  ).length;
  const correct = graded.filter((f) => isCorrect(f, answers[f.code])).length;
  const score = graded.length ? Math.round((correct / graded.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border-2 border-neutral-900 bg-white p-6 shadow-[4px_4px_0_0_rgba(250,204,21,1)]">
        <h2 className="text-[15px] font-bold tracking-tight text-neutral-900">Summary</h2>
        <p className="mt-1 text-[13px] font-medium text-neutral-500">
          {answeredCount} of {relevant.length} relevant fields answered.
        </p>
        {graded.length > 0 ? (
          <div className="mt-4 flex items-center gap-4">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e5e5" strokeWidth="4" />
                <circle
                  cx="18" cy="18" r="16" fill="none"
                  stroke={score >= 80 ? '#16a34a' : score >= 50 ? '#facc15' : '#ef4444'}
                  strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={`${(score / 100) * 100.5} 100.5`}
                />
              </svg>
              <span className="absolute text-sm font-bold text-neutral-900">{score}%</span>
            </div>
            <p className="text-[13px] font-semibold text-neutral-700">
              {correct} / {graded.length} graded fields correct
            </p>
          </div>
        ) : (
          <p className="mt-2 text-[13px] italic text-neutral-400">
            No model answers set — set them in Config to enable grading.
          </p>
        )}
      </div>

      {graded.length > 0 && (
        <div className="rounded-xl border-2 border-neutral-900 bg-white p-6 shadow-[4px_4px_0_0_rgba(250,204,21,1)]">
          <h2 className="mb-4 text-[15px] font-bold tracking-tight text-neutral-900">Graded fields</h2>
          <div className="space-y-2.5">
            {graded.map((field) => {
              const ok = isCorrect(field, answers[field.code]);
              return (
                <div
                  key={field.code}
                  className={`rounded-2xl border p-4 ${ok ? 'border-green-100 bg-green-50/70' : 'border-red-100 bg-red-50/70'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[13px] font-medium text-slate-800">
                      <span className="mr-2 font-mono text-[11px] text-slate-400">{field.code}</span>
                      {field.label}
                    </span>
                    <span className={`shrink-0 text-[13px] font-semibold ${ok ? 'text-green-600' : 'text-red-500'}`}>
                      {ok ? '✓ correct' : '✗ incorrect'}
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] text-slate-600">
                    Your answer: <strong className="font-semibold">{displayValue(answers[field.code])}</strong>
                  </p>
                  {!ok && (
                    <p className="text-[13px] text-slate-600">
                      Expected: <strong className="font-semibold">{field.modelAnswer}</strong>
                    </p>
                  )}
                  {field.guidance && (
                    <p className="mt-1.5 text-[12px] italic text-slate-400">{field.guidance}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
