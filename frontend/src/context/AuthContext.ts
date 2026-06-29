import { createContext } from 'react';
import type { User } from '@/types/user';

// Define the shape of the authentication context.
// Consumers will get the current user, loading state, and a refetch helper.
export type AuthContextType = {
    user: User | null;
    loading: boolean;
    refetch: () => void;
};

// Use undefined as the default so missing providers are easy to detect.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);