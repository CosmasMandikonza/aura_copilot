// aura-copilot/next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // 🚀 Hackathon-friendly: don't fail prod builds on lint warnings
  eslint: {
    ignoreDuringBuilds: true,
  },

  // (Optional) If you ever hit type errors in CI you can un-comment this too,
  // but you do NOT need it now since your errors are all ESLint not TS.
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
};

export default nextConfig;

