// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// When building inside Lovable's sandbox, keep the default Cloudflare bundle.
// When building on Vercel CI (env VERCEL=1), force Nitro with the Vercel preset
// and write the output to `.vercel/output` (Vercel Build Output API layout).
const isVercel = !!process.env.VERCEL;

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  // `noExternal` is a valid Nitro option but is not part of the wrapper's
  // narrowed type, so we cast. Without it the production Worker crashes with
  // `No such module "_ssr/tslib"` because Nitro's tracer emits a broken import.
  nitro: {
    noExternal: ["tslib"],
    ...(isVercel
      ? {
          preset: "vercel",
          output: { dir: ".vercel/output" },
        }
      : {}),
  } as never,
});
