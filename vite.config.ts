// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// When building inside Lovable's sandbox, keep the default Cloudflare bundle.
// When building elsewhere (e.g. Vercel CI), force Nitro on with the Vercel preset
// so the output has a serverless function the Vercel runtime can serve.
const isVercel = !!process.env.VERCEL;

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  ...(isVercel
    ? {
        nitro: {
          preset: "vercel",
        },
      }
    : {}),
});
