import { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { classNames } from '../lib/utils';

const DraftSettings = () => {
  const [draftRepliesEnabled, setDraftRepliesEnabled] = useState(true);
  const [draftPrompt, setDraftPrompt] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    setDraftRepliesEnabled(window.localStorage.getItem('draftRepliesEnabled') !== 'false');
    setDraftPrompt(window.localStorage.getItem('draftPrompt') ?? '');
  }, []);

  const handleSave = () => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem('draftRepliesEnabled', String(draftRepliesEnabled));
    window.localStorage.setItem('draftPrompt', draftPrompt.trim());
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Draft replies
        </h1>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Draft replies
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              When you receive an email that needs a reply, XProFlow will generate a
              draft response for you to review, edit, or send.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={draftRepliesEnabled}
            onClick={() => setDraftRepliesEnabled((prev) => !prev)}
            className={classNames(
              'relative inline-flex h-8 w-14 items-center rounded-full border border-transparent transition',
              draftRepliesEnabled ? 'bg-blue-600' : 'toggle-off'
            )}
          >
            <span
              className={classNames(
                'toggle-knob inline-flex h-6 w-6 transform items-center justify-center rounded-full shadow transition',
                draftRepliesEnabled ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>
      </Card>

      <Card className="info-panel space-y-4 border">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Threading helps drafts stay organized
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Draft replies work best when emails are grouped into conversation threads. Gmail
            and Outlook usually enable this by default, and drafts are saved within the email
            thread for easy access.
          </p>
        </div>
        <details className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          <summary className="cursor-pointer text-sm font-semibold text-slate-900 dark:text-slate-100">
            How to enable threading in Gmail
          </summary>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
            <li>Open Gmail settings.</li>
            <li>Scroll to the bottom.</li>
            <li>Enable Conversation View.</li>
          </ul>
        </details>
        <details className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          <summary className="cursor-pointer text-sm font-semibold text-slate-900 dark:text-slate-100">
            How to enable threading in Outlook
          </summary>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
            <li>Open Outlook settings.</li>
            <li>Go to Message Organization.</li>
            <li>Enable “Show email grouped by conversation”.</li>
          </ul>
        </details>
      </Card>

      <Card className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Draft Prompt
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Describe your preferred writing tone, length, and formatting to shape AI drafts.
          </p>
        </div>
        <textarea
          className="input-surface min-h-[140px] w-full resize-y rounded-2xl border px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          value={draftPrompt}
          onChange={(event) => setDraftPrompt(event.target.value)}
          placeholder={`“I am concise, polite, and direct.”\n“I prefer shorter emails.”\n“If explaining steps, use bullet points.”`}
        />
      </Card>

      <div className="flex justify-end">
        <Button type="button" onClick={handleSave}>
          Update preferences
        </Button>
      </div>
    </section>
  );
};

export default DraftSettings;
