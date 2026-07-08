'use client';

import { auth } from '@/_api/auth';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState, ReactNode } from 'react';
import Logout from '../../_components/logout';
import Login from '../../_components/login';

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
