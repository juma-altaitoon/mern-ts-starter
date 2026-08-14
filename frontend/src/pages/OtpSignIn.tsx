import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { signinWithOtpSchema, type OtpSignInFormValues } from '@/features/auth/authSchemas';
import { signinWithOTP } from '@/features/auth/authService';
import { AuthFormLayout } from '@/features/auth/AuthFormLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/features/notifications/useToast';

const OtpSignIn: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpSignInFormValues>({
    resolver: zodResolver(signinWithOtpSchema),
    defaultValues: { email: '' },
  });

  const mutation = useMutation({
    mutationFn: signinWithOTP,
    onSuccess: () => {
      setEmailSent(true);
      addToast('One-time code sent', 'Check your inbox for the login code.', 'success');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Unable to send the OTP code right now.';
      addToast('OTP send failed', message, 'error');
    },
  });

  return (
    <AuthFormLayout
      title="Sign in with an email code"
      subtitle="Enter your email and we will send a one-time authentication code to you."
      footerText="Prefer a password?"
      footerLink={{ to: '/auth/signin', label: 'Use regular sign in' }}
    >
      <form
        className="space-y-5"
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
      >
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-(--text)">
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <p className="text-sm leading-6 text-(--muted)">
          This is a password-free alternative. If your email is registered, a secure one-time code will be sent to you.
        </p>

        {emailSent && (
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
            A code was sent. Use the button below to continue to verification when you are ready.
          </div>
        )}

        {mutation.isError && (
          <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
            {(mutation.error as Error)?.message || 'Unable to send the code right now.'}
          </p>
        )}

        <Button
          type="submit"
          className="w-full rounded-2xl bg-(--accent) px-4 py-3 text-(--surface) hover:bg-(--accent-hover)"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Sending code...' : 'Send code'}
        </Button>

        {emailSent && (
          <Button
            type="button"
            variant="secondary"
            className="w-full rounded-2xl px-4 py-3"
            onClick={() => navigate('/auth/verify-otp')}
          >
            Verify code
          </Button>
        )}

        <div className="text-center text-sm text-(--muted)">
          <Link to="/auth/verify-otp" className="font-medium text-(--accent) transition hover:text-(--accent-hover)">
            Already have a code? Verify it here.
          </Link>
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default OtpSignIn;
