/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    FEE_ADDRESS: "bc1ptgflajc2z55rsqv55778spwalrx3g240vn68yp7a88elwdevt0rqlre4ra",
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
