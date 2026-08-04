'use client';

import { auth, loginComGoogle, logout } from '@api/auth';
import { Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { User, onAuthStateChanged } from 'firebase/auth';
import { AccountCircle, Google, Logout } from '@mui/icons-material';
import { MouseEvent, useEffect, useState } from 'react';

export default function LoginMenu() {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null);
  const menuAberto = Boolean(menuAnchor);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
  }, []);

  async function handleButtonLogin(e: MouseEvent<HTMLButtonElement>) {
    if (usuario) {
      setMenuAnchor(e.currentTarget);
    } else {
      await loginComGoogle();
    }
  }
  async function handleLogout() {
    setMenuAnchor(null);
    await logout();
    irPara();
  }

  function irPara(path: string = '/') {
    setMenuAnchor(null);
    window.location.href = path;
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
      <Button
        sx={{ display: { xs: 'none', md: 'flex' }, mx: 2 }}
        onClick={handleButtonLogin}
        size="large"
        endIcon={usuario ? <Logout /> : <Google />}
      >
        {usuario ? 'Sair ' : 'Entrar '}
      </Button>
      <IconButton
        sx={{ display: { xs: 'flex', md: 'none' } }}
        onClick={handleButtonLogin}
      >
        <AccountCircle fontSize="large" />
      </IconButton>
      {usuario && (
        <Menu
          open={menuAberto}
          anchorEl={menuAnchor}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem onClick={() => irPara('/perfil')}>Perfil</MenuItem>
          <MenuItem onClick={() => irPara('/pedidos')}>Meus Pedidos</MenuItem>
          <MenuItem onClick={() => handleLogout()}>Sair</MenuItem>
        </Menu>
      )}
    </Box>
  );
}
