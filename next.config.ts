import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // /projects was the old route. Permanent so existing links, and anything
    // that indexed it, follow through to /work.
    return [{ source: "/projects", destination: "/work", permanent: true }];
  },
};

export default nextConfig;
