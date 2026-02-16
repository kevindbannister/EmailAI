import { useEffect, useMemo, useState } from 'react';
import { classNames } from '../lib/utils';

type WritingStyleId = 'yourVoice' | 'politeProfessional' | 'crispConcise' | 'warmUpbeat';

type WritingStyleOption = {
  id: WritingStyleId;
  label: string;
  description: string;
  preview: string;
  isDefault?: boolean;
};

const WRITING_STYLE_STORAGE_KEY = 'xproflow.settings.writingStyle';
const SAMPLE_PROMPT = 'Can you send a follow-up after yesterday\'s meeting?';

const writingStyleOptions: WritingStyleOption[] = [
  {
    id: 'yourVoice',
    label: 'Your Voice',
    description: 'Natural, balanced, and closest to your usual tone.',
    preview: 'Thanks again for meeting yesterday. Just following up on the action items we discussed and next steps.',
    isDefault: true
  },
  {
    id: 'politeProfessional',
    label: 'Polite & Professional',
    description: 'Respectful, clear, and business-ready.',
    preview:
      'Thank you for your time in yesterday\'s meeting. I\'m writing to follow up on the agreed action items and proposed next steps.'
  },
  {
    id: 'crispConcise',
    label: 'Crisp & Concise',
    description: 'Short, direct, and to the point.',
    preview: 'Following up on yesterday\'s meeting: here are the action items and next steps.'
  },
  {
    id: 'warmUpbeat',
    label: 'Warm & Upbeat',
    description: 'Friendly, positive, and encouraging.',
    preview: 'Great meeting yesterday—thanks again! Just sharing a quick follow-up on action items and what\'s next.'
  }
];

const getInitialWritingStyle = (): WritingStyleId => {
  if (typeof window === 'undefined') {
    return 'yourVoice';
  }

  const savedStyle = window.localStorage.getItem(WRITING_STYLE_STORAGE_KEY);
  const isValidStyle = writingStyleOptions.some((option) => option.id === savedStyle);

  return isValidStyle ? (savedStyle as WritingStyleId) : 'yourVoice';
};

const WritingStyle = () => {
  const [savedWritingStyle, setSavedWritingStyle] = useState<WritingStyleId>(getInitialWritingStyle);
  const [draftWritingStyle, setDraftWritingStyle] = useState<WritingStyleId>(getInitialWritingStyle);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const selectedWritingStyle = useMemo(
    () => writingStyleOptions.find((option) => option.id === draftWritingStyle) ?? writingStyleOptions[0],
    [draftWritingStyle]
  );
  const hasUnsavedWritingStyle = draftWritingStyle !== savedWritingStyle;

  useEffect(() => {
    if (!hasUnsavedWritingStyle) {
      return;
    }

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', onBeforeUnload);

    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [hasUnsavedWritingStyle]);

  const saveWritingStyle = () => {
    try {
      window.localStorage.setItem(WRITING_STYLE_STORAGE_KEY, draftWritingStyle);
      setSavedWritingStyle(draftWritingStyle);
      setStatusMessage('Writing style updated.');
    } catch {
      setStatusMessage('Could not save your writing style. Please try again.');
    }
  };

  const resetWritingStyle = () => {
    setDraftWritingStyle('yourVoice');
    setStatusMessage(null);
  };

  return (
    <main className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6" aria-label="Writing style settings page">
      <header className="mb-6 border-b border-slate-100 pb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Settings</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">Writing Style</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Choose how your responses should sound by default.</p>
      </header>

      <div className="space-y-4">
        <div className="grid gap-4 xl:grid-cols-2">
          <section aria-label="Writing style presets" className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Style presets</h2>
            <p className="mt-1 text-xs text-slate-600">Pick one default style. You can change this anytime.</p>

            <div className="mt-3 space-y-2" role="radiogroup" aria-label="Select writing style">
              {writingStyleOptions.map((option) => {
                const isSelected = option.id === draftWritingStyle;

                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => {
                      setDraftWritingStyle(option.id);
                      setStatusMessage(null);
                    }}
                    className={classNames(
                      'w-full rounded-lg border p-3 text-left transition',
                      isSelected
                        ? 'border-slate-900 bg-white ring-1 ring-slate-900/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-100'
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{option.label}</p>
                      {option.isDefault ? (
                        <span className="rounded-full border border-slate-300 px-2 py-0.5 text-xs font-medium text-slate-600">
                          Default
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-slate-600">{option.description}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section aria-label="Writing style preview" className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900">Preview</h2>
            <p className="mt-1 text-xs text-slate-600">See how your selected style sounds before saving.</p>

            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Sample prompt</p>
              <p className="mt-1 text-sm text-slate-900">{SAMPLE_PROMPT}</p>
            </div>

            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Example response</p>
              <p className="mt-1 text-sm text-slate-800">{selectedWritingStyle.preview}</p>
            </div>
          </section>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <button
            type="button"
            onClick={resetWritingStyle}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
          >
            Reset to default
          </button>

          <div className="flex items-center gap-3">
            {statusMessage ? <p className="text-sm text-slate-600">{statusMessage}</p> : null}
            <button
              type="button"
              onClick={saveWritingStyle}
              disabled={!hasUnsavedWritingStyle}
              className={classNames(
                'rounded-md px-3 py-2 text-sm font-semibold text-white transition',
                hasUnsavedWritingStyle ? 'bg-slate-900 hover:bg-slate-700' : 'cursor-not-allowed bg-slate-400'
              )}
            >
              Save changes
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default WritingStyle;
