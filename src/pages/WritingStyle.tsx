import { useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, CheckCircle2, Smile, Sparkles } from 'lucide-react';
import { classNames } from '../lib/utils';

type WritingStyleId = 'yourVoice' | 'politeProfessional' | 'crispConcise' | 'warmUpbeat';

type WritingStyleOption = {
  id: WritingStyleId;
  label: string;
  description: string;
  preview: string;
  isDefault?: boolean;
  Icon: typeof CheckCircle2;
};

const WRITING_STYLE_STORAGE_KEY = 'xproflow.settings.writingStyle';
const SAMPLE_PROMPT = 'Can you send a follow-up after yesterday\'s meeting?';

const writingStyleOptions: WritingStyleOption[] = [
  {
    id: 'yourVoice',
    label: 'Your Voice',
    description: 'Natural, balanced, and closest to your usual tone.',
    preview: 'Thanks again for meeting yesterday. Just following up on the action items we discussed and next steps.',
    isDefault: true,
    Icon: CheckCircle2
  },
  {
    id: 'politeProfessional',
    label: 'Polite & Professional',
    description: 'Respectful, clear, and business-ready.',
    preview:
      'Thank you for your time in yesterday\'s meeting. I\'m writing to follow up on the agreed action items and proposed next steps.',
    Icon: BriefcaseBusiness
  },
  {
    id: 'crispConcise',
    label: 'Crisp & Concise',
    description: 'Short, direct, and to the point.',
    preview: 'Following up on yesterday\'s meeting: here are the action items and next steps.',
    Icon: CheckCircle2
  },
  {
    id: 'warmUpbeat',
    label: 'Warm & Upbeat',
    description: 'Friendly, positive, and encouraging.',
    preview: 'Great meeting yesterday—thanks again! Just sharing a quick follow-up on action items and what\'s next.',
    Icon: Smile
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
    <main
      className="relative overflow-hidden rounded-[1.75rem] border border-indigo-100 bg-gradient-to-br from-[#f2f5ff] via-[#eef2ff] to-[#e8f0ff] p-4 shadow-[0_20px_60px_rgba(66,86,160,0.18)] lg:p-6"
      aria-label="Writing style settings page"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(120,126,234,0.20),transparent_45%),radial-gradient(circle_at_82%_78%,rgba(174,198,255,0.35),transparent_35%)]" />

      <div className="relative">
        <header className="mb-6 rounded-2xl border border-indigo-100/80 bg-white/70 px-4 py-5 backdrop-blur-sm lg:px-6">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Writing Style</h1>
          <p className="mt-2 text-lg text-slate-600">Choose how your responses should sound by default.</p>
        </header>

        <section className="overflow-hidden rounded-3xl border border-indigo-100 bg-white/88 shadow-[0_10px_30px_rgba(87,99,147,0.12)] backdrop-blur-sm">
          <div className="grid lg:grid-cols-[1.35fr_1fr]">
            <div className="border-b border-indigo-100/80 p-5 lg:border-b-0 lg:border-r lg:p-6">
              <h2 className="text-3xl font-semibold text-slate-900 sm:text-[2rem]">Choose Your Default Writing Style</h2>
              <p className="mt-1 text-base text-slate-500">Choose what style you&apos;re going for before every reply.</p>

              <div className="mt-6 space-y-3" role="radiogroup" aria-label="Select writing style">
                {writingStyleOptions.map((option) => {
                  const isSelected = option.id === draftWritingStyle;
                  const Icon = option.Icon;

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
                        'w-full rounded-2xl border px-4 py-4 text-left transition sm:px-5',
                        isSelected
                          ? 'border-indigo-300 bg-gradient-to-r from-indigo-50 to-white shadow-[0_6px_18px_rgba(92,103,171,0.16)]'
                          : 'border-slate-200 bg-white/90 hover:border-slate-300 hover:bg-white'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Icon
                          className={classNames(
                            'mt-0.5 h-6 w-6 shrink-0',
                            isSelected ? 'text-indigo-600' : 'text-slate-400'
                          )}
                          strokeWidth={2}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[1.85rem]/none font-semibold text-slate-900 sm:text-xl">{option.label}</p>
                            {option.isDefault ? (
                              <span className="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
                                Default
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-base text-slate-600">{option.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={resetWritingStyle}
                className="mt-4 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Restore to default
              </button>
            </div>

            <div className="relative flex flex-col p-5 lg:p-6">
              <Sparkles className="absolute right-8 top-6 h-8 w-8 text-amber-300" />
              <div className="mb-6 rounded-2xl bg-gradient-to-r from-indigo-100/70 via-white to-amber-100/60 p-4">
                <p className="text-right text-5xl">🖋️☕</p>
              </div>

              <h3 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Preview</h3>
              <p className="mt-1 text-base text-slate-600">See how your selected style sounds before saving.</p>

              <div className="mt-4 space-y-4 rounded-2xl border border-indigo-100 bg-white/85 p-4 shadow-inner">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sample prompt</p>
                  <p className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-lg text-slate-800">{SAMPLE_PROMPT}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Example response</p>
                  <p className="mt-2 rounded-xl border border-indigo-100 bg-indigo-50/40 px-3 py-3 text-xl text-slate-800">
                    {selectedWritingStyle.preview}
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {statusMessage ? <p className="text-sm font-medium text-slate-600">{statusMessage}</p> : <span />}
                  <button
                    type="button"
                    onClick={saveWritingStyle}
                    disabled={!hasUnsavedWritingStyle}
                    className={classNames(
                      'rounded-xl px-6 py-3 text-lg font-semibold text-white transition',
                      hasUnsavedWritingStyle
                        ? 'bg-gradient-to-r from-indigo-900 to-blue-900 hover:from-indigo-800 hover:to-blue-800'
                        : 'cursor-not-allowed bg-slate-400'
                    )}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default WritingStyle;
