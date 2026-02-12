import { useState } from 'react';
import { Bell, ChevronDown, CircleHelp, Plus, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserInitials, useUser } from '../../context/UserContext';
import { DropdownMenu } from '../ui/DropdownMenu';
import { Avatar } from '../ui/Avatar';

type TopBarProps = {
  title?: string;
  primaryActionLabel?: string;
};

const TopBar = ({ title = 'Workspace', primaryActionLabel }: TopBarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login', { replace: true });
    } finally {
      setIsLoggingOut(false);
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-slate-200 bg-slate-100/95 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900">XPF</div>
          <button
            type="button"
            className="hidden rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900 md:inline-flex"
          >
            The Accurate Accountant
          </button>
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <h1 className="truncate text-sm font-semibold text-slate-700">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {primaryActionLabel ? (
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden md:inline">{primaryActionLabel}</span>
            </button>
          ) : null}

          <button
            type="button"
            aria-label="Notifications"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
          >
            <Bell className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="Help"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
          >
            <CircleHelp className="h-4 w-4" />
          </button>

          <DropdownMenu
            isOpen={isMenuOpen}
            onOpenChange={setIsMenuOpen}
            trigger={
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-200"
                aria-haspopup="menu"
                aria-expanded={isMenuOpen}
              >
                <Avatar
                  src={user.avatarUrl}
                  alt={`${user.name} avatar`}
                  fallback={getUserInitials(user.name)}
                  className="h-7 w-7 rounded-full border border-slate-300 bg-white text-[11px] font-semibold text-slate-700"
                />
                <span className="hidden text-sm font-medium text-slate-700 lg:inline">{user.name}</span>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </button>
            }
            align="right"
          >
            <button
              type="button"
              onClick={() => {
                navigate('/profile');
                setIsMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
            >
              <User className="h-4 w-4" />
              Profile
            </button>
            <button
              type="button"
              onClick={() => {
                navigate('/settings');
                setIsMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 disabled:opacity-70"
            >
              {isLoggingOut ? 'Logging out…' : 'Logout'}
            </button>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
