'use client';

import { auth } from '@api/auth';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState, ReactNode } from 'react';
import Logout from '@components/logout';
import Login from '@components/login';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, [user]);

  return (
    <>
      {user ? <>{children}</> : <Login />}
      {user && <Logout />}
    </>
  );
}
