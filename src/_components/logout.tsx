'use client';

import { Button } from '@mui/material';
import { signOut, User } from 'firebase/auth';
import { auth } from '@/api/auth';
import { useEffect, useState } from 'react';

export default function Logout() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged(setUser);
  }, []);

  async function logout() {
    try {
      await signOut(auth);
      sessionStorage.removeItem('token');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  return (
    <>
      {user && (
        <Button variant="outlined" onClick={() => logout()}>
          Deslogar
        </Button>
      )}
    </>
  );
}
