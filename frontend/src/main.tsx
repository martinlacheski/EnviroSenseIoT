import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css'
import Router from './router'
import { CitySelectorProvider } from './context';

// Crea una instancia de QueryClient
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CitySelectorProvider>
        <Router />
      </CitySelectorProvider>

    </QueryClientProvider>
  </React.StrictMode>
);
