/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    FEE_ADDRESS: "bc1q2uun5ykztlw4kqcgdtm4xy0hx7tyvymdsfzdtz",
  },
  async rewrites() {
    return [
      {
        source: "/inscribe-backend/:slug*",
        destination: "https://open-api.unisat.io/:slug*",
      },
    ];
  },
};

module.exports = nextConfig;
