import { useState } from 'react';
import Card from '../components/ui/Card';

const Settings = () => {
  const [toneCardHidden, setToneCardHidden] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return localStorage.getItem('showToneCard') === 'false';
  });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-2 text-sm text-slate-600">
          Personalize XProFlow preferences and account details. Content coming soon.
        </p>
      </div>
      <Card>
        <p className="text-sm text-slate-600">
          Placeholder for settings, preferences, and account management.
        </p>
      </Card>
      <Card className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Admin</h2>
          <p className="mt-1 text-sm text-slate-600">
            Manage dashboard announcements and onboarding prompts.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Show the “Make XProFlow sound like you” card
            </p>
            <p className="text-xs text-slate-500">
              Restore the onboarding prompt on the dashboard if it was dismissed.
            </p>
          </div>
          <button
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-300"
            onClick={() => {
              localStorage.setItem('showToneCard', 'true');
              setToneCardHidden(false);
            }}
            disabled={!toneCardHidden}
          >
            {toneCardHidden ? 'Show again' : 'Already visible'}
          </button>
        </div>
      </Card>
    </section>
  );
};

export default Settings;
