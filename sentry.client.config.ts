import { useRuntimeConfig } from '#imports';
import * as Sentry from '@sentry/nuxt';

if (useRuntimeConfig().env === 'production') {
  Sentry.init({
    dsn: useRuntimeConfig().sentry,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [Sentry.browserTracingIntegration()],
    tracePropagationTargets: ['localhost', `${useRuntimeConfig().public}/api`],
  });
}