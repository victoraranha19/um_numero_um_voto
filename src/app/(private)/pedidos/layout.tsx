import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Pedidos - Um número um voto',
  robots: {
    follow: false,
    index: false,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
