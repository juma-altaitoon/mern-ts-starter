import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { signinSchema, type SigninFormValues } from '@/features/auth/authSchemas';
import { signin } from '@/features/auth/authService';
import { AuthFormLayout } from '@/features/auth/AuthFormLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/features/notifications/ToastProvider';
import { SocialAuthButtons } from '@/features/auth/SocialAuthButtons';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { refetch } = useAuth();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: '', password: '' },
  });

  const mutation = useMutation({
    mutationFn: signin,
    onSuccess: async () => {
      // Refresh the shared auth state so the rest of the app immediately sees the session.
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      await refetch();
      addToast('Welcome back', 'You have signed in successfully.', 'success');
      navigate('/dashboard');
    },
    onError: (error) => {
      // Surface the backend error in a user-friendly way instead of failing silently.
      const message = error instanceof Error ? error.message : 'Unable to sign in right now.';
      addToast('Sign in failed', message, 'error');
    },
  });

  return (
    <AuthFormLayout
      title="Welcome back"
      subtitle="Sign in to continue to your workspace."
      footerText="New here?"
      footerLink={{ to: '/auth/signup', label: 'Create an account' }}
    >
      <form className="space-y-5" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        <SocialAuthButtons />
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-(--text)">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="w-full rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none transition focus:border-(--accent)"
            {...register('email')}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-(--text)">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className="w-full rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 pr-12 text-(--text) outline-none transition focus:border-(--accent)"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-(--muted)"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between text-sm">
          <Link to="/auth/forgot-password" className="font-medium text-(--accent) transition hover:text-(--accent-hover)">
            Forgot password?
          </Link>
        </div>

        {mutation.isError && (
          <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
            {(mutation.error as Error)?.message || 'Unable to sign in right now.'}
          </p>
        )}

        <Button type="submit" className="w-full rounded-2xl bg-(--accent) px-4 py-3 text-(--surface) hover:bg-(--accent-hover)" disabled={mutation.isPending}>
          {mutation.isPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </AuthFormLayout>
  );
};

export default SignIn;
