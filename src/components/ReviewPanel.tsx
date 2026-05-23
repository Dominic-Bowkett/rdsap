import { useMemo } from 'react';
import type { Answers, AnswerValue, Catalogue, FieldDef } from '../types';

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
  const graded = useMemo(
    () => catalogue.fields.filter((f) => (f.modelAnswer ?? '').trim() !== ''),
    [catalogue.fields],
  );

  const answeredCount = catalogue.fields.filter(
    (f) => answers[f.code] !== undefined && answers[f.code] !== '',
  ).length;

  const correct = graded.filter((f) => isCorrect(f, answers[f.code])).length;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-2 text-lg font-semibold text-slate-800">Summary</h2>
        <p className="text-sm text-slate-600">
          {answeredCount} of {catalogue.fields.length} fields answered.
        </p>
        {graded.length > 0 ? (
          <p className="mt-1 text-sm font-medium text-slate-700">
            Score: {correct} / {graded.length} graded fields correct
          </p>
        ) : (
          <p className="mt-1 text-sm italic text-slate-400">
            No model answers set — set them in Config to enable grading.
          </p>
        )}
      </div>

      {graded.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Graded fields</h2>
          <div className="space-y-3">
            {graded.map((field) => {
              const ok = isCorrect(field, answers[field.code]);
              return (
                <div
                  key={field.code}
                  className={`rounded-md border p-3 ${ok ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm font-medium text-slate-800">
                      <span className="mr-2 font-mono text-xs text-slate-500">{field.code}</span>
                      {field.label}
                    </span>
                    <span className={`text-sm font-semibold ${ok ? 'text-green-700' : 'text-red-700'}`}>
                      {ok ? '✓ correct' : '✗ incorrect'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    Your answer: <strong>{displayValue(answers[field.code])}</strong>
                  </p>
                  {!ok && (
                    <p className="text-sm text-slate-600">
                      Expected: <strong>{field.modelAnswer}</strong>
                    </p>
                  )}
                  {field.guidance && (
                    <p className="mt-1 text-xs italic text-slate-500">{field.guidance}</p>
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
