import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import router from './app/router';
import queryClient from './lib/queryClient';
// import { AuthProvider } from '@/context/AuthProvider';
import { ThemeProvider } from '@/theme/ThemeProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      {/* <AuthProvider> */}
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      {/* </AuthProvider> */}
    </ThemeProvider>
  </StrictMode>,
)
