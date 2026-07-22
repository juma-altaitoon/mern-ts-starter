import React from 'react';
import { useAuth } from '@/hooks/useAuth';

/**
 * A simple protected dashboard page that demonstrates the authenticated route experience.
 *
 * In a larger app this would likely pull in user profile data, analytics, or workspace tools.
 */
const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 py-10">
      <section className="rounded-4xl border border-(--border) bg-(--surface) p-8 shadow-2xl shadow-(--shadow)">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-(--accent)">Private workspace</p>
        <h1 className="mt-3 text-3xl font-semibold text-(--text)">Welcome back, {user?.firstName ?? 'there'}.</h1>
        <p className="mt-3 max-w-2xl text-(--muted) leading-7">
          This protected screen confirms that the auth flow is active and the session is available.
          From here, you can safely add dashboard widgets, account details, and billing panels.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-(--border) bg-(--surface-strong) p-6">
          <p className="text-sm font-semibold text-(--accent)">Account status</p>
          <p className="mt-3 text-(--text)">Your session is currently active.</p>
        </div>
        <div className="rounded-3xl border border-(--border) bg-(--surface-strong) p-6">
          <p className="text-sm font-semibold text-(--accent)">Next step</p>
          <p className="mt-3 text-(--muted)">Connect analytics, billing, and team management modules here.</p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
