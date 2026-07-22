import React from "react";
import { Button } from "@/components/ui/button";

const Contact: React.FC = () => {
  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

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

        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-(--border) bg-(--surface) p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-(--muted)">Send a message</p>

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-(--text)">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              className="w-full rounded-2xl border border-(--border) bg-(--surface-strong) px-4 py-3 text-(--text) outline-none transition focus:border-(--accent)"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-(--text)">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-(--border) bg-(--surface-strong) px-4 py-3 text-(--text) outline-none transition focus:border-(--accent)"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-(--text)">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Tell us what you’re building or ask a question..."
              className="w-full rounded-2xl border border-(--border) bg-(--surface-strong) px-4 py-3 text-(--text) outline-none transition focus:border-(--accent) resize-none"
            />
          </div>

          <div className="space-y-3">
            <Button type="submit" className="w-full rounded-2xl bg-(--accent) px-4 py-3 text-(--surface) hover:bg-(--accent-hover)">
              Send message
            </Button>
            <p className="text-sm text-(--muted)">UI-only form for now; API hookup will come later.</p>
          </div>
        </form>
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