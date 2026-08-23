import './globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import type { Metadata } from 'next';
import MyThemeProvider from '../_context/_theme/theme-provider';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ReactNode } from 'react';
import MenuNavegacao from '@components/menu-navegacao';
import ContainerRoot from '../_context/container-root';

export const metadata: Metadata = {
  title: 'Um número um voto',
  description: 'Análises de favoritismo e concorrência política',
  icons: {
    icon: '/favicon.ico',
  },
  robots: {
    follow: true,
    index: true,
  },
  keywords: [
    'corrida',
    'política',
    'brasil',
    'número',
    'voto',
    'rifa',
    'presidente',
    'candidato',
  ],
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" className={`h-full antialiased`}>
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body className="min-h-full flex flex-col">
        <AppRouterCacheProvider>
          <MyThemeProvider>
            <MenuNavegacao />
            <ContainerRoot>{children}</ContainerRoot>
          </MyThemeProvider>
        </AppRouterCacheProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
