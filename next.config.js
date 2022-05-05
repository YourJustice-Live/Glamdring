/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
  webpack: (config) => {
    // Fix for rjsf (https://github.com/rjsf-team/react-jsonschema-form/issues/2762)
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@material-ui/core': false,
      '@material-ui/icons': false,
    };

    // Allows you to import SVGs as React Components
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.jsx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

module.exports = nextConfig;
