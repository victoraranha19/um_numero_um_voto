'use client';

import { MenuRounded } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Divider,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import LoginMenu from './login-menu';
import { SITE_URL } from '@lib/constants';
import { useState } from 'react';

export default function MenuNavegacao() {
  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null);
  const menuAberto = Boolean(menuAnchor);

  function irPara(path: string = '/') {
    setMenuAnchor(null);
    window.location.href = path;
  }

  return (
    <AppBar position="sticky">
      <Toolbar
        disableGutters
        sx={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <MenuRounded fontSize="large" />
          </IconButton>
          <Menu
            open={menuAberto}
            anchorEl={menuAnchor}
            onClose={() => setMenuAnchor(null)}
          >
            <MenuItem onClick={() => irPara()}>Início</MenuItem>
            <MenuItem onClick={() => irPara('/regras')}>Regras</MenuItem>
            <MenuItem onClick={() => irPara('/resultado')}>Ganhadores</MenuItem>
            <MenuItem onClick={() => irPara('/contato')}>Contato</MenuItem>
          </Menu>
          <Divider orientation="vertical" variant="middle" flexItem />
        </Box>
        <Link href={SITE_URL} underline="none">
          <Typography variant="h5" component="h1" sx={{ px: 2 }}>
            Um número um voto
          </Typography>
        </Link>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button color="secondary" onClick={() => irPara()}>
            Início
          </Button>
          <Button color="secondary" onClick={() => irPara('/regras')}>
            Regras
          </Button>
          <Button color="secondary" onClick={() => irPara('/resultado')}>
            Ganhadores
          </Button>
          <Button color="secondary" onClick={() => irPara('/contato')}>
            Contato
          </Button>
        </Box>
        <LoginMenu />
      </Toolbar>
    </AppBar>
  );
}
