import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { createMessage } from '@/features/contact/contactService';
import { useToast } from '@/features/notifications/useToast';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  email: z.email('Please enter a valid email address.'),
  content: z.string().min(10, 'Please share a message with at least 10 characters.'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const Contact: React.FC = () => {
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      content: '',
    },
  });

  const messageMutation = useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      addToast('Message sent', 'Your message was submitted successfully.', 'success');
      reset();
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Unable to send your message right now.';
      addToast('Submission failed', message, 'error');
    },
  });

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

        <form
          onSubmit={handleSubmit((values) => messageMutation.mutate(values))}
          className="space-y-6 rounded-3xl border border-(--border) bg-(--surface) p-6"
          noValidate
        >
          <p className="text-sm uppercase tracking-[0.24em] text-(--muted)">Send a message</p>

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-(--text)">Name</label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="w-full rounded-2xl border border-(--border) bg-(--surface-strong) px-4 py-3 text-(--text) outline-none transition focus:border-(--accent)"
              placeholder="Your name"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-(--text)">Email</label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full rounded-2xl border border-(--border) bg-(--surface-strong) px-4 py-3 text-(--text) outline-none transition focus:border-(--accent)"
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium text-(--text)">Message</label>
            <textarea
              id="content"
              rows={5}
              {...register('content')}
              placeholder="Tell us what you’re building or ask a question..."
              className="w-full rounded-2xl border border-(--border) bg-(--surface-strong) px-4 py-3 text-(--text) outline-none transition focus:border-(--accent) resize-none"
              aria-invalid={Boolean(errors.content)}
            />
            {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full rounded-2xl bg-(--accent) px-4 py-3 text-(--surface) hover:bg-(--accent-hover)"
              disabled={messageMutation.isPending}
            >
              {messageMutation.isPending ? 'Sending message...' : 'Send message'}
            </Button>
            <p className="text-sm text-(--muted)">
              Your message is securely submitted to the backend for review.
            </p>
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