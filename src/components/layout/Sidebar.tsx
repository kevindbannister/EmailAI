import type { ComponentType } from 'react';
import { Cog, GanttChartSquare, House, Inbox, LifeBuoy, MailSearch, ShieldCheck } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { classNames } from '../../lib/utils';

type NavItem = {
  label: string;
  to: string;
  icon: ComponentType<{ className?: string }>;
};

const primaryItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: House },
  { label: 'Inbox', to: '/inbox', icon: Inbox },
  { label: 'Rules', to: '/rules', icon: GanttChartSquare }
];

const secondaryItems: NavItem[] = [
  { label: 'Settings', to: '/settings', icon: Cog },
  { label: 'Help & Support', to: '/integrations', icon: LifeBuoy }
];

const NavItemButton = ({ item }: { item: NavItem }) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        classNames(
          'group relative flex h-10 w-10 items-center justify-center rounded-xl border transition',
          isActive
            ? 'border-slate-300 bg-slate-900 text-white'
            : 'border-transparent text-slate-500 hover:border-slate-200 hover:bg-white hover:text-slate-700'
        )
      }
      aria-label={item.label}
    >
      <Icon className="h-5 w-5" />
      <span className="pointer-events-none absolute left-12 top-1/2 z-50 hidden -translate-y-1/2 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm group-hover:block">
        {item.label}
      </span>
    </NavLink>
  );
};

const Sidebar = () => {
  return (
    <aside className="fixed bottom-0 left-0 top-16 z-40 w-16 border-r border-slate-200 bg-slate-100/95">
      <div className="flex h-full flex-col items-center py-3">
        <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-700">
          <MailSearch className="h-5 w-5" />
        </div>

        <nav className="flex w-full flex-1 flex-col items-center gap-2">
          {primaryItems.map((item) => (
            <NavItemButton key={item.label} item={item} />
          ))}
        </nav>

        <div className="mb-2 mt-auto flex w-full flex-col items-center gap-2 border-t border-slate-200 pt-3">
          {secondaryItems.map((item) => (
            <NavItemButton key={item.label} item={item} />
          ))}
          <button
            type="button"
            className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-slate-500 transition hover:border-slate-200 hover:bg-white hover:text-slate-700"
            aria-label="Security"
          >
            <ShieldCheck className="h-5 w-5" />
            <span className="pointer-events-none absolute left-12 top-1/2 z-50 hidden -translate-y-1/2 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm group-hover:block">
              Security
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
