/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    FEE_ADDRESS: "bc1qfc6vus8uxd33crhw9x54zyk7nkmu4u4zzt0p9g",
  },
  async rewrites() {
    return [
      {
        source: "/unisat/:slug*",
        destination: "https://open-api.unisat.io/:slug*",
      },
      {
        source: "/tracker/:slug*",
        destination: "https://www.okx.com/:slug*",
      },
    ];
  },
};

module.exports = nextConfig;
