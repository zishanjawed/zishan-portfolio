// types/env-augment.d.ts
declare global {
    interface CloudflareEnv {
      /** Cloudflare Turnstile secret (set via `wrangler secret put`). */
      TURNSTILE_SECRET: string;
      /** Optional free webhook target (Slack/Discord/etc.). */
      WEBHOOK_URL?: string;
    }
  }
  export {};
  