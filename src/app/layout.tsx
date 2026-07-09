import './globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import type { Metadata } from 'next';
import MyThemeProvider from './_theme/theme-provider';
import { Typography } from '@mui/material';

export const metadata: Metadata = {
  title: 'Um número um voto',
  description: 'Análises de favoritismo e concorrência política',
};

interface RootLayoutProps {
  children: React.ReactNode;
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
            <Typography variant="h4" component="h1">
              Um número um voto
            </Typography>
            {children}
          </MyThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
