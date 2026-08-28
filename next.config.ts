import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    // Cloudinary is the image CDN, so it resizes and encodes; Next only decides
    // which widths to ask for. See lib/image-loader.ts.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/dfbuajiyj/**" },
    ],
  },
};

export default nextConfig;
