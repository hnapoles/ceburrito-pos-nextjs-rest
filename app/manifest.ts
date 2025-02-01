import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ceburritoposweb',
    short_name: 'ceburritoposweb',
    description: 'Ceburrito POS Progressive Web App built with Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icons/heart.png',
        sizes: '629x629',
        type: 'image/png',
      },
      {
        src: '/icons/heart.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}

