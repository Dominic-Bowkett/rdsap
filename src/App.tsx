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

  const toolbarBtn =
    'rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 font-medium text-slate-600 shadow-sm backdrop-blur transition hover:bg-white hover:text-slate-900';

  return (
    <div className="min-h-screen text-slate-900">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-5 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[19px] font-semibold tracking-tight text-slate-900">
                RdSAP EPC Assessor Training
              </h1>
              <p className="mt-0.5 text-[12px] text-slate-400">
                Practise recording every field for an EPC · RdSAP10 (Feb 2024) Table 31 · data stays in your browser
              </p>
            </div>
            <nav className="inline-flex shrink-0 rounded-full bg-slate-100/80 p-1 backdrop-blur">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition ${
                    mode === m.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-7">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-[13px]">
          {mode === 'config' && (
            <>
              <button onClick={() => downloadJson('rdsap-catalogue.json', catalogue)} className={toolbarBtn}>
                Export catalogue
              </button>
              <button onClick={() => catalogueFileRef.current?.click()} className={toolbarBtn}>
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
              <button onClick={() => downloadJson('rdsap-attempt.json', answers)} className={toolbarBtn}>
                Export answers
              </button>
              <button onClick={() => answersFileRef.current?.click()} className={toolbarBtn}>
                Import answers
              </button>
              <button
                onClick={() => {
                  if (confirm('Clear all answers?')) clearAnswers();
                }}
                className={toolbarBtn}
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
