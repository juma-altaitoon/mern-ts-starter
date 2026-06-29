import React, { type JSX } from "react";
import { Navigate } from 'react-router-dom';
import { useAuth } from "@/hooks/useAuth";

export const AdminRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <div className="p-8">
                Loading...
            </div>
        );
    }
    return (
        user?.role === 'admin' 
            ? children
            : <Navigate to="/dashboard" replace /> 
    );
};
