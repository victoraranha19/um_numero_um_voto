'use client';

import { auth, loginComGoogle } from '@api/auth';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import { User, signOut, onAuthStateChanged } from 'firebase/auth';
import { AccountCircle, Google, Logout } from '@mui/icons-material';
import { useEffect, useState } from 'react';

export default function LoginMenu() {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null);
  const menuAberto = Boolean(menuAnchor);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
  }, []);

  async function logout() {
    setMenuAnchor(null);
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  async function toggleLogin() {
    setMenuAnchor(null);
    if (usuario) {
      await logout();
    } else {
      await loginComGoogle();
    }
  }

  function irPara(path: string = '/') {
    setMenuAnchor(null);
    window.location.href = path;
  }

  return (
    <>
      <Button
        sx={{ display: { xs: 'none', md: 'flex' } }}
        onClick={(e) => setMenuAnchor(e.currentTarget)}
        size="large"
        endIcon={usuario ? <Logout /> : <Google />}
      >
        {usuario ? 'Sair ' : 'Entrar '}
      </Button>
      <IconButton
        sx={{ display: { xs: 'flex', md: 'none' } }}
        onClick={(e) => setMenuAnchor(e.currentTarget)}
      >
        <AccountCircle fontSize="large" />
      </IconButton>
      <Menu
        open={menuAberto}
        anchorEl={menuAnchor}
        onClose={() => setMenuAnchor(null)}
      >
        {usuario && (
          <MenuItem onClick={() => irPara('/perfil')}>Perfil</MenuItem>
        )}
        {usuario && (
          <MenuItem onClick={() => irPara('/pedidos')}>Meus Pedidos</MenuItem>
        )}
        <MenuItem onClick={() => toggleLogin()}>
          {usuario ? 'Sair' : 'Entrar'}
        </MenuItem>
      </Menu>
    </>
  );
}
