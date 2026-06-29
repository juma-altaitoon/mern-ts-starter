import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-[2rem] bg-(--surface-strong) px-6 py-16 text-(--text) shadow-(--shadow) sm:px-10 sm:py-24">
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_45%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-6">
            <p className="inline-flex rounded-full bg-(--surface) px-4 py-1 text-sm font-medium text-(--accent)">
              Built for modern SaaS teams
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-(--text) sm:text-5xl">
              Launch your product faster with a clean, modern starter.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-(--muted)">
              NovaStack gives your app a premium SaaS feel from day one, with polished
              pages, auth-ready patterns, and a minimalist interface that scales.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-(--accent) px-6 py-3 text-sm font-semibold text-(--surface) transition hover:bg-(--accent-hover)"
              >
                Launch dashboard
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-(--border) px-6 py-3 text-sm font-semibold text-(--text) transition hover:border-(--accent)"
              >
                Request demo
              </Link>
            </div>
          </div>

          <div className="grid w-full max-w-xl grid-cols-2 gap-4 lg:max-w-md">
            {['Fast setup', 'Secure auth', 'Smart analytics', 'Clean UI'].map((label) => (
              <div
                key={label}
                className="overflow-hidden rounded-3xl border border-(--border) bg-(--surface) p-6 shadow-xl shadow-(--shadow)"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--accent)">
                  {label}
                </p>
                <p className="mt-4 text-base leading-7 text-(--muted)">
                  {label === 'Fast setup'
                    ? 'Ship faster with a ready-made structure.'
                    : label === 'Secure auth'
                    ? 'Built-in auth ready for your app.'
                    : label === 'Smart analytics'
                    ? 'Visual metrics that feel premium.'
                    : 'A polished product experience for customers.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        {[
          {
            title: 'Intuitive onboarding',
            text: 'Guided defaults and modern UX patterns for product-first teams.',
          },
          {
            title: 'Composable stack',
            text: 'Simple React components and API utilities that scale cleanly.',
          },
          {
            title: 'Built for speed',
            text: 'Minimal code, polished visuals, and responsive layouts by default.',
          },
        ].map((card) => (
          <article
            key={card.title}
            className="rounded-3xl border border-(--border) bg-(--surface) p-8 shadow-xl shadow-(--shadow)"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-(--accent)">
              {card.title}
            </p>
            <p className="mt-4 text-(--muted) leading-7">{card.text}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] border border-(--border) bg-(--surface-strong) p-8 shadow-(--shadow)">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-(--accent)">
              Designed for founders
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-(--text) sm:text-4xl">
              A clean landing experience for your SaaS story.
            </h2>
            <p className="mt-4 max-w-xl text-(--muted) leading-7">
              NovaStack gives you the flexible foundation to showcase value, capture leads,
              and delight users from the first click.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              { value: '320%', label: 'Faster implementation than starting from scratch.' },
              { value: '99.9%', label: 'Uptime-ready UI with responsive, polished layouts.' },
              { value: 'Zero fluff', label: 'A lean experience without unnecessary complexity.' },
            ].map((item) => (
              <div
                key={item.value}
                className="rounded-3xl bg-(--surface) p-6 text-(--text) shadow-inner shadow-(--shadow)"
              >
                <p className="font-semibold text-(--text)">{item.value}</p>
                <p className="mt-2 text-sm text-(--muted)">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
