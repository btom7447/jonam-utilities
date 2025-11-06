/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["v5.airtableusercontent.com"],
  },
  async rewrites() {
    return [
      // Allow Firebase auth redirect handler to work on your custom domain
      {
        source: "/__/auth/:path*",
        destination: "https://jonam-utilities.firebaseapp.com/__/auth/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
