import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

// Inicialización de PostHog Analytics
posthog.init('phc_MU1Tv3bAV2xKQNdeDMgv1N9U6prrvWvWu3EJdzKoALM', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'identified_only', // Optimización para plan gratuito
  capture_pageview: false // Se maneja mejor manualmente o automático, por defecto lo dejaremos que capture
});

createRoot(document.getElementById("root")!).render(
  <PostHogProvider client={posthog}>
    <App />
  </PostHogProvider>
);