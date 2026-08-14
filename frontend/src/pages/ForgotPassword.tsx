import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/features/auth/authSchemas';
import { forgotPassword } from '@/features/auth/authService';
import { AuthFormLayout } from '@/features/auth/AuthFormLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/features/notifications/useToast';

const ForgotPassword: React.FC = () => {
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      addToast('Check your inbox', 'If an account exists, reset instructions will be sent shortly.', 'success');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Unable to send reset instructions.';
      addToast('Reset link request failed', message, 'error');
    },
  });

  return (
    <AuthFormLayout
      title="Reset your password"
      subtitle="Enter the email associated with your account and we will send a reset link."
      footerText="Remembered it?"
      footerLink={{ to: '/auth/signin', label: 'Back to sign in' }}
    >
      <form className="space-y-5" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
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

        {mutation.isSuccess && (
          <p role="status" className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600">
            If an account exists for this email, you will receive reset instructions shortly.
          </p>
        )}

        {mutation.isError && (
          <p role="alert" className="rounded-2xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
            {(mutation.error as Error)?.message || 'Unable to send reset instructions right now.'}
          </p>
        )}

        <Button type="submit" className="w-full rounded-2xl bg-(--accent) px-4 py-3 text-(--surface) hover:bg-(--accent-hover)" disabled={mutation.isPending}>
          {mutation.isPending ? 'Sending...' : 'Send reset link'}
        </Button>
      </form>
    </AuthFormLayout>
  );
};

export default ForgotPassword;
