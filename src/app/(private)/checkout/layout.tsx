import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Checkout - Um número um voto',
  robots: {
    follow: false,
    index: false,
  },
};

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
