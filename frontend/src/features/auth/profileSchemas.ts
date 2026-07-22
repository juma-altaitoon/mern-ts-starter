import { z } from 'zod';

/**
 * The profile form validates the editable fields that the backend accepts.
 *
 * We intentionally keep this schema small and explicit so the UI stays predictable.
 * The email address is treated as read-only and is shown separately in the account page.
 */
export const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  country: z.string().max(50).optional().or(z.literal('')),
  city: z.string().max(50).optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
