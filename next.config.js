/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yeuseyenka-mikalai.com',
        pathname: '/fichiers_projets/**',
      },
      {
        protocol: 'https',
        hostname: 'jfasdepzzauqkkswsykl.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
      },
    ],
  },
}

module.exports = nextConfig
