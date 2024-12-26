/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn-icons-png.flaticon.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    env: {
        DATABASE_URL: process.env.DATABASE_URL,
    }
    // experimental: {
    //     turbo: {
    //         resolveAlias: {
    //             'next/server.js': 'next/server',
    //             'next/navigation.js': 'next/navigation',
    //             'next/headers.js': 'next/headers',
    //         },
    //     },
    // },
    // reactStrictMode: false
};

export default nextConfig;
