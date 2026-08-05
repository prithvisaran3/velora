import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        // The fixture sarees are hosted here until Priya's photography lands.
        // Without it next/image throws while rendering, which unmounts the
        // whole client tree — and takes the shared canvas with it.
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
