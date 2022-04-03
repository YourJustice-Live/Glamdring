/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// Fix for rjsf (https://github.com/rjsf-team/react-jsonschema-form/issues/2762)
module.exports = {
  webpack(config) {
    config.resolve.fallback = {
      '@mui/material': false,
      '@mui/icons-material': false,
    };
    return config;
  },
};

module.exports = nextConfig;
