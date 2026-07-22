import { MenuRounded } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Divider,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import Login from './login';

export default function MenuNavegacao() {
  return (
    <AppBar position="sticky">
      <Toolbar
        disableGutters
        sx={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Stack direction="row">
          <IconButton>
            <MenuRounded fontSize="large" />
          </IconButton>
          <Divider orientation="vertical" variant="middle" flexItem />
        </Stack>
        <Typography variant="h5" component="h1" sx={{ px: 2 }}>
          Um número um voto
        </Typography>
        <Login />
      </Toolbar>
    </AppBar>
  );
}
