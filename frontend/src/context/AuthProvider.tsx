import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { User } from '@/types/user';
import { AuthContext } from './AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data, isLoading, refetch } = useQuery<User | null>({
        queryKey: ['auth', 'me'],
        queryFn: async () => {
            const res = await api.get('/auth/me');
            return res.data.user ?? null;
        },
        retry: false, // do not retry auth checks automatically
    });

    return (
        <AuthContext.Provider
            value={{
                user: data ?? null,
                loading: isLoading,
                refetch,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
