import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../components/ui/Button';

type OnboardingContainerProps = {
  totalSteps: number;
  currentStep: number;
  onContinue: () => void;
  onExit: () => void;
  children: ReactNode;
};

const OnboardingContainer = ({
  totalSteps,
  currentStep,
  onContinue,
  onExit,
  children
}: OnboardingContainerProps) => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-slate-950 px-4 py-8 text-white sm:px-8 sm:py-10">
      <button
        type="button"
        onClick={onExit}
        className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-slate-500 hover:text-white"
        aria-label="Close onboarding"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="mx-auto flex h-full max-w-3xl flex-col justify-between gap-10">
        <div className="space-y-2 pt-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Onboarding</p>
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: totalSteps }).map((_, index) => {
              const isActive = index === currentStep;
              const isComplete = index < currentStep;

              return (
                <span
                  key={index}
                  className={`h-2.5 rounded-full transition-all ${
                    isActive
                      ? 'w-8 bg-gradient-to-r from-violet-300 to-amber-200'
                      : isComplete
                        ? 'w-2.5 bg-violet-300/70'
                        : 'w-2.5 bg-slate-700'
                  }`}
                />
              );
            })}
          </div>
        </div>

        <div className="flex-1 content-center">{children}</div>

        <div className="mx-auto flex w-full max-w-md flex-col gap-3">
          <Button
            type="button"
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-violet-300 to-amber-200 text-slate-900 shadow-none hover:from-violet-200 hover:to-amber-100"
          >
            Continue
          </Button>
          <button
            type="button"
            onClick={onExit}
            className="text-sm text-slate-400 transition hover:text-slate-200"
          >
            Skip for now
          </button>
        </div>
      </div>
    </section>
  );
};

export default OnboardingContainer;
