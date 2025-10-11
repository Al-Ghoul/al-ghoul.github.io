import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer2";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
          },
        },
      ],
    });
    return config;
  },

  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },

  output: isDev ? undefined : "export",
  basePath: isDev ? undefined : "/al-ghoul",
  images: {
    unoptimized: true,
  },
};

export default withContentlayer(nextConfig);
