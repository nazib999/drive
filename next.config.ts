import type { NextConfig } from "next";

const nextConfig: NextConfig =

    {
        typescript:{
            ignoreBuildErrors:true
        },
        eslint:{
            ignoreDuringBuilds:true
        },
    experimental:{
        serverActions:{
            bodySizeLimit:'100MB'
        }
    },
    images:{

        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.freepik.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'fra.cloud.appwrite.io',
                port: '',
                pathname: '/**',
            }
        ]
    }
  /* config options here */
};

export default nextConfig;
