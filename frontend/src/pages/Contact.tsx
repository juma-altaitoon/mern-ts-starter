import React from "react";

const Contact: React.FC = () => {

  return (
    <div className="grid gap-10 rounded-4xl border border-(--border) bg-(--surface-strong) p-10 shadow-(--shadow) text-(--text) sm:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.24em] text-(--accent)">Get in touch</p>
        <h1 className="text-3xl font-semibold text-(--text) sm:text-4xl">
          Have a question or idea? Let’s chat.
        </h1>
        <p className="max-w-xl text-(--muted) leading-7">
          Whether you’re refining a feature, exploring the starter, or want a full app build,
          we’re here for you.
        </p>

        <div className="space-y-4 rounded-3xl border border-(--border) bg-(--surface) p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-(--muted)">Quick contact</p>
          <p className="text-base font-medium text-(--text)">hello@novastack.app</p>
          <p className="text-(--muted)">Expect a friendly reply and maybe a witty onboarding gif.</p>
        </div>
      </div>

      <div className="space-y-6 rounded-3xl bg-(--surface) p-8 shadow-inner shadow-(--shadow)">
        <div className="rounded-3xl border border-(--accent)/20 bg-(--accent-muted) p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-(--accent)">Office hours</p>
          <p className="mt-3 text-lg font-semibold text-(--text)">Mon–Fri · 9am–5pm</p>
        </div>

        <div className="rounded-3xl border border-(--border) bg-(--surface-strong) p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-(--muted)">Message</p>
          <p className="mt-3 text-(--muted) leading-7">
            Drop us a line with your SaaS idea, product vision, or the coolest thing you
            want this starter to do next.
          </p>
        </div>

        <div className="rounded-3xl border border-(--border) bg-(--surface-strong) p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-(--muted)">Support</p>
          <p className="mt-3 text-(--muted) leading-7">
            Need help wiring auth, state, or pages? The app is ready for your next
            customization.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;