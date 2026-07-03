import { Typography } from '@mui/material';
import CotaForm from '@components/cota-form';

export default function RifaPage() {
  return (
    <main>
      <Typography variant="h4" component="h1">
        Um número um voto
      </Typography>

      <CotaForm />
    </main>
  );
}
