import { integrationDefinitions, ruleDefinitions, workflowDefinitions } from '../lib/settingsData';
import { PRIMARY_ROLES, WRITING_STYLES } from '../lib/professionalContextTaxonomy';

export type OnboardingInput =
  | {
      kind: 'single-choice';
      id: string;
      question: string;
      options: string[];
      helper?: string;
    }
  | {
      kind: 'multi-choice';
      id: string;
      question: string;
      options: string[];
      helper?: string;
    }
  | {
      kind: 'text';
      id: string;
      question: string;
      placeholder: string;
      helper?: string;
    }
  | {
      kind: 'textarea';
      id: string;
      question: string;
      placeholder: string;
      helper?: string;
    }
  | {
      kind: 'summary';
      id: string;
      question: string;
      helper?: string;
    };

export type OnboardingStep = {
  id: string;
  title: string;
  subtitle?: string;
  input: OnboardingInput;
};

const integrationOptions = integrationDefinitions.map((integration) => integration.name);
const workflowOptions = workflowDefinitions.map((workflow) => workflow.name);
const automationOptions = ruleDefinitions.map((rule) => rule.name);

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to XProFlow',
    subtitle: 'Let’s get you set up in under 2 minutes.',
    input: {
      kind: 'single-choice',
      id: 'setupFocus',
      question: 'What should we help you set up first?',
      options: ['Inbox connection', 'Drafting tone', 'Automation rules', 'Team collaboration'],
      helper: 'We’ll prioritize the flow based on your answer in a future release.'
    }
  },
  {
    id: 'connect-email',
    title: 'Connect your email',
    subtitle: 'Choose where you want XProFlow to start helping.',
    input: {
      kind: 'single-choice',
      id: 'emailProvider',
      question: 'Which inbox do you want to connect first?',
      options: integrationOptions,
      helper: 'From Settings → Integrations: Gmail syncs drafts and labels, Outlook supports shared inboxes.'
    }
  },
  {
    id: 'how-it-works',
    title: 'How XProFlow helps you work in flow',
    subtitle: 'Pick the outcomes that matter most to you.',
    input: {
      kind: 'multi-choice',
      id: 'workflowGoals',
      question: 'What do you want XProFlow to do automatically?',
      options: [
        ...workflowOptions,
        'Apply smart labels to incoming messages',
        'Draft first responses for review'
      ],
      helper: 'These are based on the Workflows and Labels sections in Settings.'
    }
  },
  {
    id: 'rules-and-automation',
    title: 'Set rules once',
    subtitle: 'We’ll start with a simple automation baseline.',
    input: {
      kind: 'multi-choice',
      id: 'automationRules',
      question: 'Which rule templates should we prepare for you?',
      options: automationOptions,
      helper: 'From Settings → Rules: choose approvals, triage, and escalation defaults.'
    }
  },
  {
    id: 'professional-tone',
    title: 'Set your professional tone',
    subtitle: 'This helps drafts sound like your team.',
    input: {
      kind: 'single-choice',
      id: 'writingStyle',
      question: 'Which writing style best matches your voice?',
      options: [...WRITING_STYLES, 'Friendly and concise'],
      helper: 'You can fine-tune this later under Settings → Writing Style.'
    }
  },
  {
    id: 'company-size',
    title: 'How many people are in your organisation?',
    subtitle: 'We use this to tailor team and approval suggestions.',
    input: {
      kind: 'single-choice',
      id: 'companySize',
      question: 'Select your company size',
      options: ['Just me', '2-10', '11-50', '51-200', '201+']
    }
  },
  {
    id: 'invite-team',
    title: 'Invite your team',
    subtitle: 'Optional for now — add teammates when ready.',
    input: {
      kind: 'textarea',
      id: 'teamInvites',
      question: 'Who should be invited?',
      placeholder: 'Add teammate emails, separated by commas',
      helper: 'No invites are sent in this version. This is a placeholder for future team setup.'
    }
  },
  {
    id: 'role',
    title: 'What’s your role?',
    subtitle: 'So recommendations match your day-to-day workflow.',
    input: {
      kind: 'single-choice',
      id: 'primaryRole',
      question: 'Choose the role that best describes you',
      options: [...PRIMARY_ROLES],
      helper: 'Based on the Professional Context settings taxonomy.'
    }
  },
  {
    id: 'ready',
    title: 'You’re ready to go',
    subtitle: 'Quick recap before we open your dashboard.',
    input: {
      kind: 'summary',
      id: 'summary',
      question: 'Here’s what you selected:',
      helper: 'TODO: Save onboarding answers and personalize defaults automatically.'
    }
  }
];
