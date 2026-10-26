import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Nawy Orders',
    short_name: 'Nawy Orders',
    description:
      'Launch your restaurant with a branded ordering app, smart dashboard, and zero commission.',
    lang: 'en',
    dir: 'ltr',
    start_url: '/?source=pwa',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui'],
    orientation: 'any',
    background_color: '#fbf0e2',
    theme_color: '#e43820',
    categories: ['business', 'food'],
    prefer_related_applications: false,
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Start with Nawy Orders',
        short_name: 'Get started',
        url: '/#get-started',
      },
      {
        name: 'View plans',
        short_name: 'Plans',
        url: '/#pricing',
      },
    ],
  };
}
