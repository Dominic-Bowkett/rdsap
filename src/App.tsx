import { useRef, useState } from 'react';
import type { AppMode, Answers, Catalogue } from './types';
import { downloadJson, readJsonFile, useAnswers, useCatalogue } from './store';
import { SurveyForm } from './components/SurveyForm';
import { ConfigEditor } from './components/ConfigEditor';
import { ReviewPanel } from './components/ReviewPanel';

const MODES: { id: AppMode; label: string }[] = [
  { id: 'survey', label: 'Survey (trainee)' },
  { id: 'config', label: 'Config (trainer)' },
  { id: 'review', label: 'Review & feedback' },
];

export default function App() {
  const [mode, setMode] = useState<AppMode>('survey');
  const { catalogue, setCatalogue, resetToSpec } = useCatalogue();
  const { answers, setAnswer, setAnswers, clearAnswers } = useAnswers();

  const catalogueFileRef = useRef<HTMLInputElement>(null);
  const answersFileRef = useRef<HTMLInputElement>(null);

  const importCatalogue = async (file: File) => {
    try {
      const data = await readJsonFile<Catalogue>(file);
      if (data && Array.isArray(data.fields)) setCatalogue(data);
      else alert('That file does not look like a catalogue (missing "fields").');
    } catch {
      alert('Could not read that JSON file.');
    }
  };

  const importAnswers = async (file: File) => {
    try {
      setAnswers(await readJsonFile<Answers>(file));
    } catch {
      alert('Could not read that JSON file.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <h1 className="text-xl font-bold">RdSAP EPC Assessor Training</h1>
          <p className="text-sm text-slate-500">
            Practise recording every field an assessor collects for an EPC. Based on RdSAP10
            (Feb 2024) Table 31. Data stays in your browser.
          </p>
          <nav className="mt-3 flex flex-wrap gap-2">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  mode === m.id
                    ? 'bg-sky-600 text-white'
                    : 'border border-slate-300 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {m.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-5 flex flex-wrap items-center gap-2 text-sm">
          {mode === 'config' && (
            <>
              <button
                onClick={() => downloadJson('rdsap-catalogue.json', catalogue)}
                className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-100"
              >
                Export catalogue
              </button>
              <button
                onClick={() => catalogueFileRef.current?.click()}
                className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-100"
              >
                Import catalogue
              </button>
              <input
                ref={catalogueFileRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && importCatalogue(e.target.files[0])}
              />
            </>
          )}
          {mode !== 'config' && (
            <>
              <button
                onClick={() => downloadJson('rdsap-attempt.json', answers)}
                className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-100"
              >
                Export answers
              </button>
              <button
                onClick={() => answersFileRef.current?.click()}
                className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-100"
              >
                Import answers
              </button>
              <button
                onClick={() => {
                  if (confirm('Clear all answers?')) clearAnswers();
                }}
                className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-100"
              >
                Clear answers
              </button>
              <input
                ref={answersFileRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && importAnswers(e.target.files[0])}
              />
            </>
          )}
        </div>

        {mode === 'survey' && (
          <SurveyForm catalogue={catalogue} answers={answers} setAnswer={setAnswer} />
        )}
        {mode === 'config' && (
          <ConfigEditor
            catalogue={catalogue}
            setCatalogue={setCatalogue}
            resetToSpec={resetToSpec}
          />
        )}
        {mode === 'review' && <ReviewPanel catalogue={catalogue} answers={answers} />}
      </main>
    </div>
  );
}
