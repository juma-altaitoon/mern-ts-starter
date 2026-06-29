import React from "react";

const About: React.FC = () => {
  return (
    <div className="space-y-8 rounded-3xl border border-(--border) bg-(--surface-strong) p-10 shadow-(--shadow) text-(--text)">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.24em] text-(--accent)">About NovaStack</p>
        <h1 className="text-3xl font-semibold text-(--text) sm:text-4xl">
          We make modern SaaS feel effortless.
        </h1>
        <p className="max-w-2xl text-(--muted) leading-8">
          NovaStack was designed to help teams move fast without sacrificing polish. It’s
          built to feel premium, work smoothly, and stay easy to adapt.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {[
          {
            title: 'Our mission',
            body: 'Give startups a stylish foundation so they can focus on product, not setup.',
          },
          {
            title: 'Our values',
            body: 'Simplicity, thoughtful defaults, and high-quality interactions.',
          },
          {
            title: 'What we build',
            body: 'Landing pages, auth flows, and dashboard-ready components that look sharp.',
          },
          {
            title: 'Why it works',
            body: 'Minimal design, smart structure, and a feel that customers trust.',
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-(--border) bg-(--surface) p-6"
          >
            <h2 className="text-xl font-semibold text-(--text)">{item.title}</h2>
            <p className="mt-3 text-(--muted) leading-7">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[2rem] border border-(--border) bg-(--surface) p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-(--accent)">Fun fact</p>
        <p className="mt-4 text-(--muted) leading-7">
          This starter is made to feel like a product, not a demo — every route should look
          like a premium page your customers would love.
        </p>
        <p className="mt-4 text-(--muted) text-sm">
          It stays lightweight, but with enough polish to look like a real SaaS brand.
        </p>
      </div>
    </div>
  );
};

export default About;