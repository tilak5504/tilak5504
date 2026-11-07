import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import Photography from './pages/Photography.tsx';
import './index.css';

const isPhotography = window.location.pathname.replace(/\/+$/, '') === '/photography';

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isPhotography ? <Photography /> : <App />}</StrictMode>
);
