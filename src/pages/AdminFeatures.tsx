import { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { type FeatureFlags, useFeatureFlags } from '../context/FeatureFlagsContext';

const featureLabels: Array<{ key: keyof FeatureFlags; label: string }> = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'inbox', label: 'Inbox' },
  { key: 'labels', label: 'Labels' },
  { key: 'rules', label: 'Rules' },
  { key: 'drafting', label: 'Drafting' },
  { key: 'writingStyle', label: 'Writing Style' },
  { key: 'signatureTimeZone', label: 'Signature & Time Zone' },
  { key: 'professionalContext', label: 'Professional Context' },
  { key: 'account', label: 'Account' },
  { key: 'help', label: 'Help' },
];

const AdminFeatures = () => {
  const { flags, updateFlags, isLoading } = useFeatureFlags();
  const [localFlags, setLocalFlags] = useState(flags);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalFlags(flags);
  }, [flags]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateFlags(localFlags);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <h2 className="text-lg font-semibold">Master Admin: Feature Controls</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Turn menu sections on/off globally for every user.</p>
        <div className="space-y-2">
          {featureLabels.map((item) => (
            <label key={item.key} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
              <span>{item.label}</span>
              <input
                type="checkbox"
                checked={Boolean(localFlags[item.key])}
                onChange={(e) => setLocalFlags((current) => ({ ...current, [item.key]: e.target.checked }))}
                disabled={isLoading || isSaving}
              />
            </label>
          ))}
        </div>
        <Button type="button" onClick={handleSave} disabled={isLoading || isSaving}>
          {isSaving ? 'Saving…' : 'Save feature settings'}
        </Button>
      </Card>
    </div>
  );
};

export default AdminFeatures;
