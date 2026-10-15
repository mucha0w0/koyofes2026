/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // ファイル名にハッシュが無い静的ファイル。再検証のたびに CDN リクエストにしない。
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|ico|pdf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000',
          },
        ],
      },
    ];
  },
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
