// open-next.config.ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// You can wire R2 ISR cache later; leaving minimal now:
export default defineCloudflareConfig({
  // incrementalCache: r2IncrementalCache, // see docs when you enable R2
});
