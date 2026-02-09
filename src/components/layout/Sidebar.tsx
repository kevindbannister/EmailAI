import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Mail, Settings } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { getUserInitials, useUser } from '../../context/UserContext';
import { classNames } from '../../lib/utils';

const navigation = [
  { label: 'Inbox', to: '/inbox', icon: Mail },
];

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { user } = useUser();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!profileMenuRef.current) {
        return;
      }
      if (!profileMenuRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    navigate('/login', { replace: true });
  };

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
              className="group flex w-full items-center justify-center"
              aria-label={item.label}
            >
              {({ isActive }: { isActive: boolean }) => (
                <span
                  className={classNames(
                    'flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300',
                    isActive
                      ? 'border-slate-300 bg-slate-900 text-white dark:border-slate-600 dark:bg-slate-100 dark:text-slate-900'
                      : 'group-hover:border-slate-300 group-hover:text-slate-900 dark:group-hover:border-slate-600 dark:group-hover:text-slate-100'
                  )}
                  title={item.label}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center justify-center gap-3 px-2 pb-2">
        <div ref={profileMenuRef} className="relative">
          <button
            type="button"
            className="group flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-slate-100"
            aria-label="Profile menu"
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((open) => !open)}
          >
            <span title="Profile" className="flex items-center justify-center">
              <Avatar
                src={user.avatarUrl}
                alt={`${user.name} avatar`}
                fallback={getUserInitials(user.name)}
                className="h-8 w-8 rounded-full bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </span>
          </button>
          {profileOpen && (
            <div
              role="menu"
              className="absolute bottom-0 left-full ml-3 w-40 rounded-2xl border border-slate-200 bg-white p-2 text-sm text-slate-700 shadow-xl dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            >
              <NavLink
                to="/profile"
                onClick={() => setProfileOpen(false)}
                className="block rounded-xl px-3 py-2 font-medium hover:bg-slate-100 dark:hover:bg-slate-900"
                role="menuitem"
              >
                Profile
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-1 w-full rounded-xl px-3 py-2 text-left font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                role="menuitem"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        <NavLink
          to="/settings"
          className={({ isActive }: { isActive: boolean }) =>
            classNames(
              'group flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300',
              isActive
                ? 'border-slate-300 bg-slate-900 text-white dark:border-slate-600 dark:bg-slate-100 dark:text-slate-900'
                : 'hover:border-slate-300 hover:text-slate-900 dark:hover:border-slate-600 dark:hover:text-slate-100'
            )
          }
          aria-label="Settings"
        >
          <span title="Settings" className="flex items-center justify-center">
            <Settings className="h-5 w-5" strokeWidth={1.6} />
          </span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
