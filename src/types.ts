export type FieldType = 'enum' | 'multienum' | 'number' | 'boolean' | 'text';

export interface FieldDef {
  /** RdSAP Table 31 code, e.g. "4-2". */
  code: string;
  /** Section grouping, e.g. "Walls". */
  section: string;
  /** Human-readable item name. */
  label: string;
  type: FieldType;
  /** Allowed values for enum / multienum. */
  options?: string[];
  /** Unit hint for number fields, e.g. "mm", "m²", "W/m²K". */
  unit?: string;
  /** Guidance shown to the trainee (the spec "Comment" column). */
  guidance?: string;
  /** Optional trainer-set correct answer. When present, the answer is graded. */
  modelAnswer?: string;
  /** True for items recorded per building part / per wall / per window etc. */
  repeatable?: boolean;
}

/** A trainee's answer to one field. For repeatable fields, value is an array. */
export type AnswerValue = string | number | boolean | string[];

export type Answers = Record<string, AnswerValue>;

export interface Catalogue {
  /** Spec version label, e.g. "RdSAP10 (Feb 2024)". */
  version: string;
  fields: FieldDef[];
}

export type AppMode = 'survey' | 'config' | 'review';
