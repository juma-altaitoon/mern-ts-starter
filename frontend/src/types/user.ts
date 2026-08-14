// User types
export type Role = 'user' | 'admin';

export interface User {
    id?: string;
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    country?: string;
    city?: string;
    dateOfBirth?: Date;
    role?: Role;
    avatar?: string | null;
};
