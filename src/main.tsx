// Safeguard to prevent: Cannot set property fetch of #<Window> which has only a getter
try {
  const originalFetch = window.fetch;
  let currentFetch = originalFetch;
  try {
    Object.defineProperty(window, 'fetch', {
      get() { return currentFetch; },
      set(val) { currentFetch = val; },
      configurable: true,
      enumerable: true
    });
  } catch (e) {
    try {
      (window as any).fetch = originalFetch;
    } catch (err2) {
      console.warn("Could not patch window.fetch via direct assignment:", err2);
    }
  }
} catch (err) {
  console.warn("Could not patch window.fetch getter/setter in main.tsx:", err);
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
