// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

/* eslint-disable @typescript-eslint/no-var-requires */
const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/daygrid',
  '@fullcalendar/interaction',
  '@fullcalendar/list',
  '@fullcalendar/react',
  '@fullcalendar/timegrid',
  '@fullcalendar/timeline',
]);

module.exports = withTM({
  swcMinify: false,
  experimental: {
    swcPlugins: [
      [
        'next-superjson-plugin',
        {
          excluded: [],
        },
      ],
    ],
  },
  env: {
    // HOST
    HOST_API_KEY: 'https://minimal-assets-api-dev.vercel.app',
    // MAPBOX
    MAPBOX_API: '',
    // MINE
    ROOT_DOMAIN: process.env.ROOT_DOMAIN,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_DATABASE_URL: process.env.NEXT_PUBLIC_DATABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
  },
  images: {
    domains: ['mybvkrkmvnuzeqvzgbzg.supabase.co'],
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'mybvkrkmvnuzeqvzgbzg.supabase.co',
    //     pathname: '/storage/**',
    //   },
    // ],
  },
});
