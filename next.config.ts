import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.env.NODE_ENV === 'development' ? '..' : undefined,
  },
};

export default nextConfig;
