import { Typography } from '@mui/material';
import CotaForm from '../../../_components/cota-form';
import Logout from '../../../_components/logout';

export default function RifaPage() {
  return (
    <main>
      <Typography variant="h4" component="h1">
        Um número um voto
      </Typography>

      <CotaForm />

      <Logout />
    </main>
  );
}
