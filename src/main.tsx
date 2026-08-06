import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { LiveDataProvider } from './lib/liveStore.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LiveDataProvider>
      <App />
    </LiveDataProvider>
  </StrictMode>,
);
