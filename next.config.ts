import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // proxy.ts strips the trailing slash itself, in the same redirect that sends
  // an old URL to its final one: "/pt/blog/<old-slug>/" reaches the final URL
  // in one 308 instead of two (Next's slash redirect, then the slug redirect).
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
