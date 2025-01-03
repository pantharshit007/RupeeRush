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
            {
                protocol: 'https',
                hostname: 'framerusercontent.com',
                port: '',
                pathname: '/**',
            }
        ],
    },
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
