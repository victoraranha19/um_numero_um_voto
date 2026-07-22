'use client';

import { auth, loginComGoogle } from '@api/auth';
import { Button, IconButton } from '@mui/material';
import { User, signOut, onAuthStateChanged } from 'firebase/auth';
import { AccountCircle, Google, Logout, NoAccounts } from '@mui/icons-material';
import { useEffect, useState } from 'react';

export default function Login() {
  const [usuario, setUsuario] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
  }, []);

  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  async function toggleLogin() {
    if (usuario) {
      await logout();
    } else {
      await loginComGoogle();
    }
  }

  return (
    <>
      <Button
        sx={{ display: { xs: 'none', sm: 'flex' } }}
        onClick={() => toggleLogin()}
        size="large"
        endIcon={usuario ? <Logout /> : <Google />}
      >
        {usuario ? 'Sair ' : 'Entrar '}
      </Button>
      <IconButton
        sx={{ display: { xs: 'flex', sm: 'none' } }}
        onClick={() => toggleLogin()}
      >
        {usuario ? (
          <NoAccounts fontSize="large" />
        ) : (
          <AccountCircle fontSize="large" />
        )}
      </IconButton>
    </>
  );
}
