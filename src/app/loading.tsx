import { Backdrop, CircularProgress } from '@mui/material';

export default function CheckoutLoading() {
  return (
    <Backdrop open>
      <CircularProgress aria-label="Carregando página" />
    </Backdrop>
  );
}
