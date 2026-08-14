import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { signout } from '@/features/auth/authService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  House,
  Info,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MoonStar,
  Settings,
  Sun,
  UserRound,
  X,
} from 'lucide-react';

type NavItem = {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
};

const publicNavItems: NavItem[] = [
  { label: 'Home', to: '/', icon: House },
  { label: 'About', to: '/about', icon: Info },
  { label: 'Contact', to: '/contact', icon: Mail },
];

const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const location = useLocation();
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: signout,
    onSuccess: async () => {
      queryClient.setQueryData(['auth', 'me'], null);
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user?.firstName || user?.email?.split('@')[0] || 'Account';
  const avatarLabel = user?.firstName?.[0] || user?.email?.[0] || 'U';

  return (
    <header className="sticky top-0 z-40 border-b border-(--border)/70 bg-(--surface)/95 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>

          <Link
            to="/"
            className="flex items-center gap-2 rounded-full px-2 py-1.5 transition hover:bg-(--surface-strong)"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-(--accent) to-(--accent-muted) text-sm font-semibold text-(--surface)">
              N
            </div>
            <span className="hidden text-sm font-semibold tracking-tight text-(--text) sm:inline">
              NovaStack
            </span>
          </Link>
        </div>

        <nav className="hidden flex-1 justify-center md:flex">
          <ul className="flex items-center gap-1 rounded-full border border-(--border)/70 bg-(--surface-strong)/70 p-1">
            {publicNavItems.map(({ label, to, icon: Icon }) => {
              const isActive = location.pathname === to;

              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? 'bg-(--accent-muted) text-(--accent)'
                        : 'text-(--muted) hover:bg-(--surface) hover:text-(--text)'
                    }`}
                  >
                    <Icon className="size-4" />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative" ref={accountMenuRef}>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => setAccountMenuOpen((open) => !open)}
              className="rounded-full p-0.5 border-0"
              aria-expanded={accountMenuOpen}
              aria-label="Open account menu"
              disabled={loading}
            >
              {loading ? (
                <div className="flex size-8 items-center justify-center rounded-full bg-(--surface-strong) text-xs font-semibold text-(--muted)">
                  •
                </div>
              ) : user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={displayName}
                  className="size-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-8 items-center justify-center rounded-full bg-(--accent-muted) text-sm font-semibold text-(--accent)">
                  {avatarLabel}
                </div>
              )}
            </Button>



            {accountMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-(--border)/70 bg-(--surface) p-2 shadow-lg shadow-black/10">
                <div className="mb-2 rounded-xl border border-(--border)/60 bg-(--surface-strong)/70 px-3 py-2">
                  <p className="text-sm font-semibold text-(--text)">{loading ? 'Checking session...' : displayName}</p>
                  <p className="text-xs text-(--muted)">
                    {loading ? 'Preparing your account menu' : user?.email || 'Signed in to your workspace'}
                  </p>
                </div>

                <div className="space-y-1">
                  {user ? (
                    <>
                      { user.role === 'admin' 
                        ? (
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-(--text) transition hover:bg-(--surface-strong)"
                          onClick={() => setAccountMenuOpen(false)}
                        >
                          <LayoutDashboard className="size-4" />
                          Dashboard
                        </Link> )
                        :
                        null
                      }
                      <Link
                        to="/account"
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-(--text) transition hover:bg-(--surface-strong)"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        <Settings className="size-4" />
                        Account
                      </Link>
                    </>
                  ) : (
                    <div className="rounded-xl border border-dashed border-(--border)/70 px-3 py-3 text-sm text-(--muted)">
                      Sign in to access your dashboard and account settings.
                    </div>
                  )}

                  {user ? (
                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        logoutMutation.mutate();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-(--text) transition hover:bg-(--surface-strong)"
                    >
                      <LogOut className="size-4" />
                      {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
                    </button>
                  ) : (
                    <Link
                      to="/auth/signin"
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-(--text) transition hover:bg-(--surface-strong)"
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      <UserRound className="size-4" />
                      Sign in
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={toggleTheme}
            className="rounded-full"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="size-4" /> : <MoonStar className="size-4" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div id="mobile-nav" className="border-t border-(--border)/60 bg-(--surface) px-4 py-3 md:hidden">
          <nav className="space-y-1">
            {publicNavItems.map(({ label, to, icon: Icon }) => {
              const isActive = location.pathname === to;

              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-(--accent-muted) text-(--accent)'
                      : 'text-(--text) hover:bg-(--surface-strong)'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;