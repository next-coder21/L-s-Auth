/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ls-auth/contracts', '@ls-auth/config', '@ls-auth/ui'],
};

module.exports = nextConfig;

