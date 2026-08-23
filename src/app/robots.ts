import { SITE_URL } from '@lib/constants';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*', // Regra aplicada a todos os robôs
        allow: '/', // Permite rastrear todo o site por padrão
        disallow: [
          '/api/', // Rotas de API internas
          '/checkout/', // Rotas de API internas
          '/pedidos/', // Painel administrativo
          '/perfil/', // Conteúdo privado
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`, // Aponta para o mapa do site
  };
}
