import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/features/auth/authSchemas';
import { resetPassword } from '@/features/auth/authService';
import { AuthFormLayout } from '@/features/auth/AuthFormLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/features/notifications/useToast';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const mutation = useMutation({
    mutationFn: (values: ResetPasswordFormValues) => resetPassword({ token: token ?? '', password: values.password }),
    onSuccess: () => {
      addToast('Password reset', 'Your password has been updated successfully.', 'success');
      navigate('/auth/signin');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Unable to reset your password right now.';
      addToast('Reset failed', message, 'error');
    },
  });

  if (!token) {
    return (
      <AuthFormLayout
        title="Reset password"
        subtitle="The reset link is invalid or missing."
        footerText="Need help?"
        footerLink={{ to: '/auth/forgot-password', label: 'Request a new reset link' }}
      >
        <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-6 text-sm text-red-500">
          We could not find a valid token in the current URL. Please use the reset link from your email.
        </div>
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout
      title="Set a new password"
      subtitle="Choose a secure password for your account."
      footerText="Remembered your password?"
      footerLink={{ to: '/auth/signin', label: 'Sign in instead' }}
    >
      <form className="space-y-5" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-(--text)">
            New password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
          />
          {errors.password && (
            <p id="password-error" className="text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-(--text)">
            Confirm new password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p id="confirmPassword-error" className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <p className="text-sm leading-6 text-(--muted)">
          The link is time-limited. If your code has expired, request a new reset email from the forgot password page.
        </p>

        {mutation.isError && (
          <p role="alert" className="rounded-2xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
            {(mutation.error as Error)?.message || 'Unable to update your password right now.'}
          </p>
        )}

        <Button
          type="submit"
          className="w-full rounded-2xl bg-(--accent) px-4 py-3 text-(--surface) hover:bg-(--accent-hover)"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Resetting password...' : 'Reset password'}
        </Button>

        <div className="text-center text-sm text-(--muted)">
          <Link to="/auth/forgot-password" className="font-medium text-(--accent) transition hover:text-(--accent-hover)">
            Request a new reset link
          </Link>
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default ResetPassword;
