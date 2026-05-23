import { useCallback, useEffect, useState } from 'react';
import type { Answers, AnswerValue, Catalogue } from './types';
import { RDSAP_CATALOGUE } from './data/rdsapCatalogue';

const CATALOGUE_KEY = 'rdsap.catalogue.v1';
const ANSWERS_KEY = 'rdsap.answers.v1';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Catalogue state: the field definitions a trainer curates. Persisted to localStorage. */
export function useCatalogue() {
  const [catalogue, setCatalogue] = useState<Catalogue>(() =>
    load(CATALOGUE_KEY, clone(RDSAP_CATALOGUE)),
  );

  useEffect(() => {
    localStorage.setItem(CATALOGUE_KEY, JSON.stringify(catalogue));
  }, [catalogue]);

  const resetToSpec = useCallback(() => setCatalogue(clone(RDSAP_CATALOGUE)), []);

  return { catalogue, setCatalogue, resetToSpec };
}

/** Trainee answers. Persisted to localStorage. */
export function useAnswers() {
  const [answers, setAnswers] = useState<Answers>(() => load(ANSWERS_KEY, {}));

  useEffect(() => {
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
  }, [answers]);

  const setAnswer = useCallback((code: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [code]: value }));
  }, []);

  const clearAnswers = useCallback(() => setAnswers({}), []);

  return { answers, setAnswer, setAnswers, clearAnswers };
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function readJsonFile<T>(file: File): Promise<T> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(String(reader.result)) as T);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
