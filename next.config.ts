import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: [
        '192.168.1.35',
        '192.168.1.100',
        'localhost:3000',
        'wynncraft-explorer.vercel.app'
    ],
};

export default nextConfig;
