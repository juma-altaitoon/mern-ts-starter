// User types
export type Role = 'user' | 'admin';

export interface User {
    id?: string;
    _id?: string;
    firstName?: string;
    email?: string;
    role?: Role;
    avatar?: string | null;
};
