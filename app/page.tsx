import { Typography } from '@mui/material';
import { getCotas } from '@lib/actions';
import CotaForm from './components/cota-form';
import CotaList from './components/cota-list';

export default async function AppPage() {
  const cotas = await getCotas();

  return (
    <main>
      <Typography variant="h4" component="h1">
        Um número um voto
      </Typography>

      <CotaForm />

      <CotaList cotas={cotas} />
    </main>
  );
}
