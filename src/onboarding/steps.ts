export type OnboardingStep = {
  id: string;
  title: string;
  subtitle?: string;
};

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to XProFlow',
    subtitle: 'Let’s get you set up.'
  },
  {
    id: 'connect-email',
    title: 'Connect your email'
  },
  {
    id: 'how-it-works',
    title: 'How XProFlow helps you work in flow'
  },
  {
    id: 'rules-and-automation',
    title: 'Set rules once'
  },
  {
    id: 'professional-tone',
    title: 'Set your professional tone'
  },
  {
    id: 'company-size',
    title: 'How many people are in your organisation?'
  },
  {
    id: 'invite-team',
    title: 'Invite your team'
  },
  {
    id: 'role',
    title: 'What’s your role?'
  },
  {
    id: 'ready',
    title: 'You’re ready to go'
  }
];
