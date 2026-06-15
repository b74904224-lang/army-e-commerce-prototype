/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a minimal self-contained server bundle for Docker/OVHcloud deploys.
  output: 'standalone',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
