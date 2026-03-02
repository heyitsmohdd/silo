import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'

// --------------------------------------------------------------------
// CRITICAL PWA CACHE UNLOCKER
// iOS aggressively freezes the entire JS bundle. We must forcefully
// unregister the old Worker before React even mounts so the browser
// is forced to fetch the new Dashboard layout from the Vercel edge.
// --------------------------------------------------------------------
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let registration of registrations) {
      registration.unregister().then(registered => {
        if (registered) console.log('[PWA Unlocker] Forcefully purged stale Service Worker');
      });
    }
  });

  // Also aggressively wipe the caches storage API so old CSS/JS is dropped
  caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      console.log('[PWA Unlocker] Purging old cache storage:', key);
      return caches.delete(key);
    }));
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
