import { useMemo, useState } from 'react';
import Card from '../components/ui/Card';
import { Button } from '../components/ui/Button';

type SmartLabel = {
  id: string;
  name: string;
  description: string;
  color: string;
  defaultEnabled: boolean;
};

const smartLabels: SmartLabel[] = [
  {
    id: 'to-respond',
    name: 'To Respond',
    description: 'Highlights threads that still need a reply.',
    color: '#EF4444',
    defaultEnabled: true
  },
  {
    id: 'fyi',
    name: 'FYI',
    description: 'Useful context and updates that do not require action.',
    color: '#3B82F6',
    defaultEnabled: true
  },
  {
    id: 'notification',
    name: 'Notification',
    description: 'System notifications and automated status messages.',
    color: '#F59E0B',
    defaultEnabled: true
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Promotions, campaigns, and newsletter content.',
    color: '#8B5CF6',
    defaultEnabled: false
  },
  {
    id: 'meeting-update',
    name: 'Meeting Update',
    description: 'Calendar changes, confirmations, and meeting follow-ons.',
    color: '#14B8A6',
    defaultEnabled: true
  },
  {
    id: 'follow-up',
    name: 'Follow Up',
    description: 'Conversations where a reminder should be sent soon.',
    color: '#22C55E',
    defaultEnabled: true
  }
];

const buildInitialState = () =>
  smartLabels.reduce<Record<string, boolean>>((accumulator, label) => {
    accumulator[label.id] = label.defaultEnabled;
    return accumulator;
  }, {});

const Labels = () => {
  const [enabledByLabel, setEnabledByLabel] = useState<Record<string, boolean>>(buildInitialState);

  const enabledCount = useMemo(
    () => Object.values(enabledByLabel).filter(Boolean).length,
    [enabledByLabel]
  );

  const toggleLabel = (labelId: string) => {
    setEnabledByLabel((currentState) => ({
      ...currentState,
      [labelId]: !currentState[labelId]
    }));
  };

  const setAllLabels = (enabled: boolean) => {
    setEnabledByLabel(
      smartLabels.reduce<Record<string, boolean>>((accumulator, label) => {
        accumulator[label.id] = enabled;
        return accumulator;
      }, {})
    );
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Label settings</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Enable the labels X-ProFlow should use while triaging inbox messages.
        </p>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Smart labels</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {enabledCount} of {smartLabels.length} labels currently active.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => setAllLabels(true)}>
              Select all
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setAllLabels(false)}>
              Deselect all
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {smartLabels.map((label) => {
            const enabled = enabledByLabel[label.id];

            return (
              <div
                key={label.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: label.color }} />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{label.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{label.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className="rounded-full px-2 py-1 text-xs font-medium"
                    style={{
                      color: enabled ? label.color : '#64748B',
                      backgroundColor: enabled ? `${label.color}20` : '#E2E8F0'
                    }}
                  >
                    {enabled ? 'Enabled' : 'Disabled'}
                  </span>

                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() => toggleLabel(label.id)}
                      className="peer sr-only"
                      aria-label={`${enabled ? 'Disable' : 'Enable'} ${label.name} label`}
                    />
                    <span className="toggle-off relative h-6 w-11 rounded-full transition peer-checked:bg-blue-600">
                      <span className="toggle-knob absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow transition peer-checked:translate-x-5" />
                    </span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recommended next step</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Add automation rules for your enabled labels so each one triggers triage actions, reminders,
          or routing behavior.
        </p>
      </Card>
    </section>
  );
};

export default Labels;
