import React from 'react';
import { Link } from 'react-router-dom';

interface AuthFormLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerLink: { to: string; label: string };
}

export const AuthFormLayout: React.FC<AuthFormLayoutProps> = ({
  title,
  subtitle,
  children,
  footerText,
  footerLink,
}) => {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-(--border) bg-(--surface) p-8 shadow-2xl shadow-(--shadow)">
        <div className="mb-8 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-(--accent)">NovaStack</p>
          <h1 className="text-3xl font-semibold text-(--text)">{title}</h1>
          <p className="text-sm leading-6 text-(--muted)">{subtitle}</p>
        </div>

        {children}

        <p className="mt-6 text-center text-sm text-(--muted)">
          {footerText}{' '}
          <Link to={footerLink.to} className="font-semibold text-(--accent) transition hover:text-(--accent-hover)">
            {footerLink.label}
          </Link>
        </p>
      </div>
    </div>
  );
};
