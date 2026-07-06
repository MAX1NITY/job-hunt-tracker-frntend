import * as Sentry from '@sentry/react'

// No-op until VITE_SENTRY_DSN is set (e.g. in Vercel env vars). Keeps local
// dev and CI free of any Sentry network calls or account requirement.
const dsn = import.meta.env.VITE_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
  })
}

export { Sentry }
