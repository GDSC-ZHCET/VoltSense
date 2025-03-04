import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  output: "standalone",
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp3)$/,
      type: "asset/resource",
      generator: {
        filename: "static/media/[name].[hash][ext]",
      },
    });
    return config;
  },
  async headers() {
    return [
      {
        source: "/firebase-messaging-sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript" },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
