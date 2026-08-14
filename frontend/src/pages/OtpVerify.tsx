import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { verifyOtpSchema, type OtpVerifyFormValues } from '@/features/auth/authSchemas';
import { verifyOTP, resendOTP } from '@/features/auth/authService';
import { AuthFormLayout } from '@/features/auth/AuthFormLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OtpInput } from '@/components/ui/otp-input';
import { useToast } from '@/features/notifications/useToast';

const OtpVerify: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const emailPrefill = (location.state as { email?: string } | null)?.email ?? '';

  const [emailValue, setEmailValue] = useState(emailPrefill);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpVerifyFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { email: emailPrefill, otp: '' },
  });

  const [resendTimer, setResendTimer] = useState(0);

  const verifyMutation = useMutation({
    mutationFn: verifyOTP,
    onSuccess: () => {
      addToast('Signed in', 'Your one-time code has been verified successfully.', 'success');
      navigate('/dashboard');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Unable to verify the code right now.';
      addToast('Verification failed', message, 'error');
    },
  });

  const resendMutation = useMutation({
    mutationFn: resendOTP,
    onSuccess: (data) => {
      const cooldown = typeof data?.cooldown === 'number' ? data.cooldown : 30;
      setResendTimer(cooldown);
      addToast('OTP resent', 'A fresh verification code has been sent to your inbox.', 'success');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Unable to resend your code right now.';
      addToast('Resend failed', message, 'error');
    },
  });

  useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setResendTimer((value) => Math.max(value - 1, 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [resendTimer]);

  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleResendClick = () => {
    if (!emailValue) return;
    resendMutation.mutate({ email: emailValue });
  };

  return (
    <AuthFormLayout
      title="Verify your sign-in code"
      subtitle="Enter the one-time code that was emailed to you."
      footerText="Need a fresh code?"
      footerLink={{ to: '/auth/otp', label: 'Request another code' }}
    >
      <form className="space-y-5" onSubmit={handleSubmit((values) => verifyMutation.mutate(values))}>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-(--text)">
            Email
          </label>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                value={field.value ?? ''}
                onChange={(event) => {
                  field.onChange(event);
                  setEmailValue(event.target.value);
                }}
              />
            )}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="otp" className="text-sm font-medium text-(--text)">
              One-time code
            </label>
            <span className="text-xs text-(--muted)">6 digits</span>
          </div>
          <Controller
            control={control}
            name="otp"
            render={({ field }) => (
              <OtpInput
                id="otp"
                value={field.value}
                onChange={field.onChange}
                error={!!errors.otp}
              />
            )}
          />
          {errors.otp && (
            <p className="text-sm text-red-500">{errors.otp.message}</p>
          )}
        </div>

        <p className="text-sm leading-6 text-(--muted)">
          If the code does not arrive within a few minutes, request a new code or check your spam folder.
        </p>

        <div className="space-y-3">
          <Button
            type="button"
            variant="secondary"
            className="w-full rounded-2xl px-4 py-3"
            onClick={handleResendClick}
            disabled={!emailValue || resendTimer > 0 || resendMutation.isPending}
          >
            {resendTimer > 0
              ? `Resend available in ${formatTimer(resendTimer)}`
              : 'Resend code'}
          </Button>

          <p className="text-center text-sm text-(--muted)">
            {resendTimer > 0
              ? 'Please wait before requesting a new code. This helps prevent duplicate emails and accidental requests.'
              : 'Click to request a new email code if you did not receive the first one.'}
          </p>
        </div>

        {resendMutation.isError && (
          <p role="alert" className="rounded-2xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
            {(resendMutation.error as Error)?.message || 'Unable to resend the code right now.'}
          </p>
        )}

        {verifyMutation.isError && (
          <p role="alert" className="rounded-2xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
            {(verifyMutation.error as Error)?.message || 'The code could not be verified.'}
          </p>
        )}

        <Button
          type="submit"
          className="w-full rounded-2xl bg-(--accent) px-4 py-3 text-(--surface) hover:bg-(--accent-hover)"
          disabled={verifyMutation.isPending}
        >
          {verifyMutation.isPending ? 'Verifying...' : 'Verify code'}
        </Button>

        <div className="text-center text-sm text-(--muted)">
          <Link to="/auth/signin" className="font-medium text-(--accent) transition hover:text-(--accent-hover)">
            Back to regular sign in
          </Link>
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default OtpVerify;
