import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "books.google.com" },
      { protocol: "http",  hostname: "books.google.com" },
      { protocol: "https", hostname: "covers.openlibrary.org" },
      { protocol: "https", hostname: "www.gutenberg.org" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "www.hindawi.org" },
      { protocol: "https", hostname: "archive.org" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "**.archive.org" },
      { protocol: "https", hostname: "openlibrary.org" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
