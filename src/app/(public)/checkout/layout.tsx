import AuthProvider from '@/_contexts/auth-provider';
import { ReactNode } from 'react';

interface CheckoutLayoutProps {
  children: ReactNode;
}

export default function CheckoutLayout({ children }: CheckoutLayoutProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
