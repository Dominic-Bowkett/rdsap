import type { Answers, AnswerValue, FieldCondition, FieldDef } from './types';

function conditionMet(cond: FieldCondition, value: AnswerValue | undefined): boolean {
  if (cond.is !== undefined) return value === cond.is;
  if (cond.in) {
    if (value === undefined || value === '') return false;
    return cond.in.includes(String(value));
  }
  // No predicate given: pass when the controlling field has any answer.
  return value !== undefined && value !== '';
}

/**
 * Whether a field should be shown given the current answers. Visibility is
 * recursive: a condition only passes if its controlling field is itself
 * visible AND its answer matches. This makes chained dependencies collapse
 * correctly (e.g. solar collector details hide when the solar panel is absent),
 * and ignores stale answers left behind on now-hidden parents.
 */
export function isFieldVisible(
  field: FieldDef,
  answers: Answers,
  byCode: Map<string, FieldDef>,
  seen: Set<string> = new Set(),
): boolean {
  if (!field.visibleWhen || field.visibleWhen.length === 0) return true;
  if (seen.has(field.code)) return true; // guard against accidental cycles
  const path = new Set(seen).add(field.code);
  return field.visibleWhen.every((cond) => {
    const parent = byCode.get(cond.field);
    if (parent && !isFieldVisible(parent, answers, byCode, new Set(path))) return false;
    return conditionMet(cond, answers[cond.field]);
  });
}

export function indexByCode(fields: FieldDef[]): Map<string, FieldDef> {
  return new Map(fields.map((f) => [f.code, f]));
}

/** The subset of fields currently visible for the given answers, order preserved. */
export function visibleFields(fields: FieldDef[], answers: Answers): FieldDef[] {
  const byCode = indexByCode(fields);
  return fields.filter((f) => isFieldVisible(f, answers, byCode));
}
