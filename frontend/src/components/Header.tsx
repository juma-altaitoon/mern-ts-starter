import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';

const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-(--border) bg-(--surface)/95 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-(--text) sm:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-semibold tracking-tight text-(--text)">
            NovaStack
          </Link>
          <nav>
            <ul className="flex flex-wrap items-center gap-4 text-sm text-(--muted)">
              <li>
                <Link to="/" className="transition hover:text-(--accent)">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition hover:text-(--accent)">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition hover:text-(--accent)">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="rounded-full border border-(--border) bg-(--surface-strong) px-4 py-2 font-semibold text-(--text) transition hover:border-(--accent) hover:text-(--accent)"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-full border border-(--border) bg-(--surface-strong) px-4 py-2 text-sm font-semibold text-(--text) transition hover:border-(--accent) hover:bg-(--accent-muted)"
        >
          {isDark ? '☀️ Light mode' : '🌙 Dark mode'}
        </button>
      </div>
    </header>
  );
};

export default Header;