import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@fontsource/fira-sans/400.css';
import '@fontsource/fira-sans/700.css';
import '@fontsource/fira-sans/800.css';
import './styles/globals.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
