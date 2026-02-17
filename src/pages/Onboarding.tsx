import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingContainer from '../onboarding/components/OnboardingContainer';
import OnboardingStep from '../onboarding/components/OnboardingStep';
import { onboardingSteps } from '../onboarding/steps';

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const handleExit = () => {
    // TODO: Persist onboarding progress once backend state is ready.
    navigate('/dashboard');
  };

  const handleContinue = () => {
    // TODO: Save step-level onboarding preferences before advancing.
    if (currentStep >= onboardingSteps.length - 1) {
      // TODO: Mark onboarding as completed and suppress entry points.
      navigate('/dashboard');
      return;
    }

    setCurrentStep((previousStep) => previousStep + 1);
  };

  return (
    <OnboardingContainer
      totalSteps={onboardingSteps.length}
      currentStep={currentStep}
      onContinue={handleContinue}
      onExit={handleExit}
    >
      <OnboardingStep step={onboardingSteps[currentStep]} />
    </OnboardingContainer>
  );
};

export default Onboarding;
