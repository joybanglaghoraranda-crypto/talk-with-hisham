import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Ignore specific browser extension or third-party errors
  ignoreErrors: [
    "TypeError: Object [object Object] has no method 'updateFrom'",
    "TypeError: can't access dead object",
  ],

  // Block errors originating from browser extensions
  denyUrls: [
    /extensions\//i,
    /^chrome-extension:\/\//i,
    /^moz-extension:\/\//i,
    /safari-extension:\/\//i,
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
