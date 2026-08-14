// import React from 'react';
import  { createBrowserRouter } from 'react-router-dom';
import App from './App';

import Home from '@/pages/Home';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import ForgotPassword from '@/pages/ForgotPassword';
import OtpSignIn from '@/pages/OtpSignIn';
import OtpVerify from '@/pages/OtpVerify';
import ResetPassword from '@/pages/ResetPassword';
import Dashboard from '@/pages/Dashboard';
import Account from '@/pages/Account';
import NotFound from '@/pages/NotFound';
import { AuthGuard } from '@/features/auth/AuthGuard';
import { AdminRoute } from '@/routes/AdminRoutes';
// import { PrivateRoute } from '@/routes/PrivateRoutes';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            { path: 'about', element: <About /> },
            { path: 'contact', element: <Contact /> },
            { path: 'auth/signin', element: <AuthGuard requireAuth={false}><SignIn /></AuthGuard> },
            { path: 'auth/signup', element: <AuthGuard requireAuth={false}><SignUp /></AuthGuard> },
            { path: 'auth/forgot-password', element: <AuthGuard requireAuth={false}><ForgotPassword /></AuthGuard> },
            { path: 'auth/otp', element: <AuthGuard requireAuth={false}><OtpSignIn /></AuthGuard> },
            { path: 'auth/verify-otp', element: <AuthGuard requireAuth={false}><OtpVerify /></AuthGuard> },
            { path: 'auth/reset/:token', element: <AuthGuard requireAuth={false}><ResetPassword /></AuthGuard> },
            { path: 'dashboard', element: <AuthGuard><AdminRoute><Dashboard /></AdminRoute></AuthGuard> },
            { path: 'account', element: <AuthGuard><Account /></AuthGuard> },
            { path: '*', element: <NotFound /> },
        ]
    }
]);

export default router;