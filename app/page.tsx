import { Typography } from '@mui/material';
import VotoForm from './components/voto-form';
import VotoList from './components/voto-list';

export default function AppPage() {
  return (
    <main>
      <Typography variant="h4" component="h1">
        Um número um voto
      </Typography>

      <VotoList />

      <VotoForm />
    </main>
  );
}
