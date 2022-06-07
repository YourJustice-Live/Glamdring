const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
  i18n,
  react: { useSuspense: false },
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
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            replaceAttrValues: { '#5E42CC': '{props.color || "#5E42CC"}' },
            svgoConfig: {
              plugins: [
                {
                  name: 'removeViewBox',
                  active: false,
                },
              ],
            },
          },
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig;
