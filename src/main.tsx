import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import { AnswersProvider } from './state/AnswersContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AnswersProvider>
        <App />
      </AnswersProvider>
    </BrowserRouter>
  </StrictMode>,
);

// Register the service worker; auto-updates without prompting the user.
registerSW({ immediate: true });
