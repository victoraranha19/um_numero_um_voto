import { MenuRounded } from '@mui/icons-material';
import {
  AppBar,
  Divider,
  IconButton,
  Link,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import Login from './login';
import { SITE_URL } from '@lib/constants';

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
        <Link href={SITE_URL} underline="none">
          <Typography variant="h5" component="h1" sx={{ px: 2 }}>
            Um número um voto
          </Typography>
        </Link>
        <Login />
      </Toolbar>
    </AppBar>
  );
}
