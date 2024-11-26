/** @type {import('next').NextConfig} */

import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '127.0.0.1',
            },
            {
                protocol: "https",
                hostname: "strapi.jcpolyhsp.hk",
                port: "",
                pathname: "/**",
            },
        ],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};
  
// export default nextConfig;

export default withNextIntl(nextConfig);