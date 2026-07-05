'use client';

import { auth } from '@/_api/auth';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState, ReactNode } from 'react';
import Logout from './logout';
import Login from './login';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  return (
    <>
      {user ? <>{children}</> : <Login />}
      {user && <Logout />}
    </>
  );
}
