/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // fix the issue with the src of the image from the third party app
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*lh3.googleusercontent.com',
        port: '',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: '*platform-lookaside.fbsbx.com',
        port: '',
        pathname: '**'
      }
    ]
  }
}

module.exports = nextConfig
