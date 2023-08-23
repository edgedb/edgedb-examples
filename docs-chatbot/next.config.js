/** @type {import('next').NextConfig} */

module.exports = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: false,
      stream: false,
    };

    return config;
  },
};
