import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './globals.css';

import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

export const metadata: Metadata = {
  title: 'Um número um voto',
  description: 'Análises de favoritismo e concorrência política',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`h-full antialiased`}>
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body className="min-h-full flex flex-col">
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  );
}
