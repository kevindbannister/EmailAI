import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Mail, Settings } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { classNames } from '../../lib/utils';

const navigation = [
  { label: 'Inbox', to: '/inbox', icon: Mail },
  { label: 'Settings', to: '/settings', icon: Settings }
];

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { user } = useUser();
  return (
    <aside
      className={classNames(
        'sidebar-surface fixed inset-y-0 left-0 z-40 flex flex-col border-r py-8 transition-all',
        collapsed ? 'w-20 px-3' : 'w-20 px-3'
      )}
    >
      <div className="flex items-center justify-center">
        <span className="text-lg font-semibold tracking-[0.3em] text-slate-900 dark:text-slate-100">
          XPF
        </span>
      </div>
      <button
        type="button"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        onClick={onToggle}
        className="sr-only"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <nav className="mt-8 flex flex-1 flex-col items-center gap-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }: { isActive: boolean }) =>
                classNames(
                  'group flex w-full flex-col items-center gap-2 rounded-2xl px-2 py-3 text-[11px] font-medium text-slate-500 transition',
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                    : 'hover:bg-white/70 hover:text-slate-800 dark:hover:bg-slate-900/70 dark:hover:text-slate-100'
                )
              }
            >
              {({ isActive }: { isActive: boolean }) => (
                <>
                  <span
                    className={classNames(
                      'flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300',
                      isActive
                        ? 'border-slate-300 bg-slate-900 text-white dark:border-slate-600 dark:bg-slate-100 dark:text-slate-900'
                        : 'group-hover:border-slate-300 group-hover:text-slate-900 dark:group-hover:border-slate-600 dark:group-hover:text-slate-100'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-6 flex flex-col items-center gap-2 px-2 text-center">
        <img
          src={user.avatarUrl}
          alt={`${user.name} avatar`}
          className="h-10 w-10 rounded-2xl border border-white/60 object-cover shadow-sm dark:border-slate-900"
        />
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
          {user.email && (
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{user.email}</p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
