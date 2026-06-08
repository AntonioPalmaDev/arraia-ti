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
  nitro: {
    // Inline tslib into the SSR bundle. Nitro's tracer was emitting a broken
    // `_ssr/tslib` import that does not exist (the real chunk is `_libs/tslib`),
    // causing every published request to crash with `No such module "_ssr/tslib"`.
    noExternal: ["tslib"],
    ...(isVercel
      ? {
          preset: "vercel",
          // Vercel Build Output API expects everything under `.vercel/output`.
          output: { dir: ".vercel/output" },
        }
      : {}),
  },
});
