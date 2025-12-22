import '../css/app.css';
import '../css/article-content.css';
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { MantineProvider } from '@mantine/core';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <MantineProvider>
                <App {...props} />
            </MantineProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .catch((error) => {
        console.error('Service worker registration failed:', error);
      });
  });
}
// This will set light / dark mode on load...
initializeTheme();
