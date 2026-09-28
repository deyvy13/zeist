import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // AI assistants and answer engines, allowed explicitly: being cited in
      // ChatGPT, Claude, Gemini and Perplexity answers is a growth channel.
      // Listing them keeps a future blanket rule from blocking them by accident.
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-SearchBot",
          "PerplexityBot",
          "Google-Extended",
        ],
        allow: "/",
      },
    ],
    sitemap: absoluteUrl("sitemap.xml"),
    host: absoluteUrl(),
  };
}
