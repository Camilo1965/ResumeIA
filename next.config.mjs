import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfiguration = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
}

export default withNextIntl(nextConfiguration);
