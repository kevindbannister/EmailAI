import type { OnboardingStep as OnboardingStepType } from '../steps';

type OnboardingAnswers = Record<string, string | string[]>;

type OnboardingStepProps = {
  step: OnboardingStepType;
  answers: OnboardingAnswers;
  onAnswerChange: (key: string, value: string | string[]) => void;
};

const baseOptionStyles =
  'rounded-xl border px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300';

const OnboardingStep = ({ step, answers, onAnswerChange }: OnboardingStepProps) => {
  const currentValue = answers[step.input.id];

  const renderInput = () => {
    if (step.input.kind === 'single-choice') {
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          {step.input.options.map((option) => {
            const selected = currentValue === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onAnswerChange(step.input.id, option)}
                className={`${baseOptionStyles} ${
                  selected
                    ? 'border-violet-200 bg-violet-300/20 text-white'
                    : 'border-slate-700 bg-slate-900/70 text-slate-300 hover:border-slate-500 hover:text-white'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      );
    }

    if (step.input.kind === 'multi-choice') {
      const selectedValues = Array.isArray(currentValue) ? currentValue : [];

      return (
        <div className="grid gap-2 sm:grid-cols-2">
          {step.input.options.map((option) => {
            const selected = selectedValues.includes(option);
            const nextValues = selected
              ? selectedValues.filter((value) => value !== option)
              : [...selectedValues, option];

            return (
              <button
                key={option}
                type="button"
                onClick={() => onAnswerChange(step.input.id, nextValues)}
                className={`${baseOptionStyles} text-left ${
                  selected
                    ? 'border-violet-200 bg-violet-300/20 text-white'
                    : 'border-slate-700 bg-slate-900/70 text-slate-300 hover:border-slate-500 hover:text-white'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      );
    }

    if (step.input.kind === 'text') {
      return (
        <input
          type="text"
          value={typeof currentValue === 'string' ? currentValue : ''}
          onChange={(event) => onAnswerChange(step.input.id, event.target.value)}
          placeholder={step.input.placeholder}
          className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
        />
      );
    }

    if (step.input.kind === 'textarea') {
      return (
        <textarea
          value={typeof currentValue === 'string' ? currentValue : ''}
          onChange={(event) => onAnswerChange(step.input.id, event.target.value)}
          placeholder={step.input.placeholder}
          rows={3}
          className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
        />
      );
    }

    if (step.input.kind === 'summary') {
      const entries = Object.entries(answers).filter(([key]) => key !== 'summary');

      return (
        <div className="space-y-2 rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-left">
          {entries.length ? (
            entries.map(([key, value]) => (
              <p key={key} className="text-sm text-slate-200">
                <span className="font-semibold text-white">{key}:</span>{' '}
                {Array.isArray(value) ? value.join(', ') || '—' : value || '—'}
              </p>
            ))
          ) : (
            <p className="text-sm text-slate-300">You can go back and answer a few questions, or continue to finish.</p>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{step.title}</h1>
        {step.subtitle ? <p className="text-base text-slate-300 sm:text-lg">{step.subtitle}</p> : null}
      </div>

      <div className="space-y-3 text-left">
        <p className="text-sm font-semibold uppercase tracking-wide text-violet-200">{step.input.question}</p>
        {renderInput()}
        {step.input.helper ? <p className="text-xs text-slate-400">{step.input.helper}</p> : null}
      </div>
    </div>
  );
};

export default OnboardingStep;
