import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { profileSchema, type ProfileFormValues } from '@/features/auth/profileSchemas';
import { getProfile, updateProfile } from '@/features/auth/profileService';
import { useToast } from '@/features/notifications/ToastProvider';

/**
 * Editable account page backed by the existing backend profile endpoints.
 *
 * The form uses React Hook Form for local state and TanStack Query for data fetching and mutation.
 * This keeps the page component focused on presentation while the data layer stays reusable.
 */
const Account: React.FC = () => {
  const { user, loading, refetch } = useAuth();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: !loading,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      country: '',
      city: '',
      dateOfBirth: '',
    },
  });

  useEffect(() => {
    if (profileData?.user) {
      reset({
        firstName: profileData.user.firstName ?? '',
        lastName: profileData.user.lastName ?? '',
        country: profileData.user.country ?? '',
        city: profileData.user.city ?? '',
        dateOfBirth: profileData.user.dateOfBirth ? new Date(profileData.user.dateOfBirth).toISOString().slice(0, 10) : '',
      });
    }
  }, [profileData, reset]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      await refetch();
      addToast('Profile updated', 'Your account details have been saved.', 'success');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Unable to update your profile right now.';
      addToast('Profile update failed', message, 'error');
    },
  });

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
        <div className="rounded-full border border-(--border) bg-(--surface) px-5 py-3 text-sm text-(--muted)">
          Loading account...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 py-10">
      <section className="rounded-[2rem] border border-(--border) bg-(--surface) p-8 shadow-2xl shadow-(--shadow)">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-(--accent)">Account profile</p>
        <h1 className="mt-3 text-3xl font-semibold text-(--text)">Hello, {user?.firstName ?? 'there'}.</h1>
        <p className="mt-3 max-w-2xl text-(--muted) leading-7">
          Update your personal details and keep your account information current.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form
          className="rounded-3xl border border-(--border) bg-(--surface-strong) p-6"
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
        >
          <p className="text-sm font-semibold text-(--accent)">Edit profile</p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-(--text)">First name</label>
              <input className="w-full rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none transition focus:border-(--accent)" {...register('firstName')} />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-(--text)">Last name</label>
              <input className="w-full rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none transition focus:border-(--accent)" {...register('lastName')} />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-(--text)">Country</label>
              <input className="w-full rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none transition focus:border-(--accent)" {...register('country')} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-(--text)">City</label>
              <input className="w-full rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none transition focus:border-(--accent)" {...register('city')} />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <label className="text-sm font-medium text-(--text)">Date of birth</label>
            <input type="date" className="w-full rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none transition focus:border-(--accent)" {...register('dateOfBirth')} />
          </div>

          <button type="submit" className="mt-6 w-full rounded-2xl bg-(--accent) px-4 py-3 text-sm font-semibold text-(--surface) transition hover:bg-(--accent-hover)" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Save changes'}
          </button>
        </form>

        <div className="rounded-3xl border border-(--border) bg-(--surface-strong) p-6">
          <p className="text-sm font-semibold text-(--accent)">Account summary</p>
          <dl className="mt-4 space-y-4 text-sm text-(--muted)">
            <div className="flex items-center justify-between border-b border-(--border) pb-3">
              <dt className="font-medium text-(--text)">Name</dt>
              <dd>{user?.firstName ?? 'Not available'}</dd>
            </div>
            <div className="flex items-center justify-between border-b border-(--border) pb-3">
              <dt className="font-medium text-(--text)">Email</dt>
              <dd>{user?.email ?? 'Not available'}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="font-medium text-(--text)">Role</dt>
              <dd>{user?.role ?? 'user'}</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
};

export default Account;
