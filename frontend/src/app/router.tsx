// import React from 'react';
import  { createBrowserRouter } from 'react-router-dom';
import App from './App';

import Home from '@/pages/Home';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';
// import { AdminRoute } from '@/routes/AdminRoutes';
// import { PrivateRoute } from '@/routes/PrivateRoutes';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            { path: 'about', element: <About /> },
            { path: 'contact', element: <Contact /> },
            { path: '*', element: <NotFound /> },
        ]
    }
]);

export default router;