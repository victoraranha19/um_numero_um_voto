'use client';

import { auth } from '@/api/auth';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import Logout from './logout';
import Login from './login';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged(setUser);
  }, []);

  return (
    <>
      {user ? <>{children}</> : <Login />}
      {user && <Logout />}
    </>
  );
}
