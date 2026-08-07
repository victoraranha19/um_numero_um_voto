import { Backdrop, CircularProgress } from '@mui/material';

export default function Carregando() {
  return (
    <Backdrop open>
      <CircularProgress />
    </Backdrop>
  );
}
