import api from '@/lib/api';

export type ProfileUpdatePayload = {
  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  dateOfBirth?: string;
  avatar?: string;
};

/**
 * Fetch the current authenticated user's profile from the backend.
 */
export const getProfile = async () => {
  const { data } = await api.get('/user/profile');
  return data;
};

/**
 * Persist profile changes to the backend.
 */
export const updateProfile = async (payload: ProfileUpdatePayload) => {
  const { data } = await api.put('/user/profile', payload);
  return data;
};
