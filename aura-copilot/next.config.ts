/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // avoid a PPR/turbopack + React 19 edge case that triggers the dev overlay
    ppr: false,
  },
}
export default nextConfig
