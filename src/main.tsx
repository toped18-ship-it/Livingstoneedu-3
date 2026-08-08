import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { LiveDataProvider } from './lib/liveStore.tsx';
import './index.css';

if (typeof window !== "undefined") {
  const report = (payload: any) =>
    fetch("/__client_err", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).catch(() => {});
  window.addEventListener("error", (e) => report({ type: "error", message: e.message, filename: e.filename, lineno: e.lineno, colno: e.colno, stack: e.error?.stack }));
  window.addEventListener("unhandledrejection", (e) => {
    const r = e.reason;
    report({ type: "unhandledrejection", message: r?.message || String(r), stack: r?.stack });
  });
  setTimeout(() => report({ type: "dom", html: document.documentElement.innerHTML.slice(0, 3000) }), 8000);
}

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('Service worker registration failed', err);
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LiveDataProvider>
      <App />
    </LiveDataProvider>
  </StrictMode>,
);
