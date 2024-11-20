// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    domains: ["localhost"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/es",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
