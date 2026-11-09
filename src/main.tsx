import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import Photography from './pages/Photography.tsx';
import { initTracking } from './lib/track';
import './index.css';

const Tracker = lazy(() => import('./pages/Tracker.tsx'));

const path = initTracking();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {path === '/photography' ? (
      <Photography />
    ) : path === '/tracker' ? (
      <Suspense fallback={null}>
        <Tracker />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>
);
