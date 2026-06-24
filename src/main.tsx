import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import { AnswersProvider } from './state/AnswersContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <AnswersProvider>
        <App />
      </AnswersProvider>
    </HashRouter>
  </StrictMode>,
);

// Register the service worker; auto-updates without prompting the user.
registerSW({ immediate: true });
