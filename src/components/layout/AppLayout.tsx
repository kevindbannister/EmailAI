import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

type LayoutMeta = {
  title: string;
  primaryActionLabel?: string;
};

const routeMeta: Record<string, LayoutMeta> = {
  dashboard: { title: 'Dashboard', primaryActionLabel: 'New Report' },
  inbox: { title: 'Inbox', primaryActionLabel: 'New Message' },
  rules: { title: 'Rules', primaryActionLabel: 'Add Rule' },
  labels: { title: 'Labels', primaryActionLabel: 'Add Label' },
  integrations: { title: 'Integrations', primaryActionLabel: 'Connect App' },
  workflows: { title: 'Workflows', primaryActionLabel: 'New Workflow' },
  settings: { title: 'Settings' },
  profile: { title: 'Profile' },
  onboarding: { title: 'Onboarding' },
  'email-setup': { title: 'Email Setup' }
};

const defaultMeta: LayoutMeta = {
  title: 'Workspace',
  primaryActionLabel: 'New'
};

const AppLayout = () => {
  const location = useLocation();
  const [section = ''] = location.pathname.split('/').filter(Boolean);
  const meta = routeMeta[section] ?? defaultMeta;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <TopBar title={meta.title} primaryActionLabel={meta.primaryActionLabel} />
      <Sidebar />

      <div className="pl-16 pt-16">
        <main className="h-[calc(100vh-4rem)] overflow-y-auto px-6 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
