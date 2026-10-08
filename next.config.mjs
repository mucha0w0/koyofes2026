/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/about/contact',
        destination: '/guide/contact',
        permanent: true,
      },
    ];
  },
  serverExternalPackages: ['@electric-sql/pglite', 'postgres'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
