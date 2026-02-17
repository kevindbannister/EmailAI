import type { OnboardingStep as OnboardingStepType } from '../steps';

type OnboardingStepProps = {
  step: OnboardingStepType;
};

const OnboardingStep = ({ step }: OnboardingStepProps) => {
  return (
    <div className="space-y-3 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{step.title}</h1>
      {step.subtitle ? (
        <p className="text-base text-slate-300 sm:text-lg">{step.subtitle}</p>
      ) : (
        <p className="text-sm text-slate-400">Placeholder content for this onboarding step.</p>
      )}
    </div>
  );
};

export default OnboardingStep;
