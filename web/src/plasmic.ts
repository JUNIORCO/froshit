import { initPlasmicLoader } from '@plasmicapp/loader-nextjs';

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: 'qQTsD1f7XjYV3YRdRHSywm',
      token: process.env.NEXT_PUBLIC_PLASMIC_API_KEY ?? '',
    },
  ],
  preview: process.env.NODE_ENV === 'development',
});
