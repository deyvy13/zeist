import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.slogan.es}`,
    short_name: site.name,
    description: site.description.es,
    start_url: "/es",
    display: "standalone",
    // Splash background matches the icon's dark ground, not the light site
    // theme — otherwise the installed app flashes white behind a dark icon.
    background_color: "#061110",
    theme_color: site.themeColor,
    // Order and `purpose` matter on Android. A `sizes: "any"` entry (the old
    // placeholder SVG) outranks concrete sizes, so the installed app showed
    // that generic mark instead of the real brand icon — it is gone from here.
    //
    // `maskable` icons keep the artwork inside the middle ~80% because Android
    // crops the edges to fit its adaptive shape; the plain `any` icons are the
    // full-bleed art used where no mask is applied.
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    ],
  };
}
