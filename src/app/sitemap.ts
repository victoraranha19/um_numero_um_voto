import { SITE_URL } from '@lib/constants';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/rifa`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/sobre`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/regras`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/resultado`,
      lastModified: new Date(),
    },
  ];
}
