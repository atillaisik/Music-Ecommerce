/**
 * Sentry initialization stub.
 *
 * No-ops if `VITE_SENTRY_DSN` is not set, so the app works fine in
 * development without any Sentry account. To enable in production:
 *
 *   1. `npm install @sentry/react`
 *   2. Set `VITE_SENTRY_DSN=<your-dsn>` in Vercel environment variables.
 *
 * The dynamic `import(...)` is wrapped so TypeScript doesn't try to resolve
 * the module until runtime — meaning you don't have to install it just to
 * compile this file.
 */
export const initSentry = (): void => {
    const dsn = import.meta.env.VITE_SENTRY_DSN;
    if (!dsn) {
        if (import.meta.env.DEV) {
            console.info('[sentry] DSN not set — error reporting disabled.');
        }
        return;
    }

    const moduleId = '@sentry/react';
    // The /* @vite-ignore */ comment lets Vite skip its static analysis so an
    // uninstalled module doesn't break the build.
    import(/* @vite-ignore */ moduleId)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((Sentry: any) => {
            Sentry.init({
                dsn,
                environment: import.meta.env.MODE,
                tracesSampleRate: 0.1,
                replaysSessionSampleRate: 0.0,
                replaysOnErrorSampleRate: 1.0,
            });
            console.info('[sentry] initialized');
        })
        .catch((err) => {
            console.warn(
                '[sentry] failed to load @sentry/react — install it with `npm install @sentry/react` to enable error reporting.',
                err,
            );
        });
};

/**
 * Capture an exception manually. No-op if Sentry isn't wired up.
 */
export const captureException = async (err: unknown): Promise<void> => {
    if (!import.meta.env.VITE_SENTRY_DSN) return;
    try {
        const moduleId = '@sentry/react';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Sentry: any = await import(/* @vite-ignore */ moduleId);
        Sentry.captureException(err);
    } catch {
        // Module not installed — silently no-op
    }
};
