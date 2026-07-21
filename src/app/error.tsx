'use client';

import { SITE_URL } from '@lib/constants';
import { SentimentDissatisfiedRounded } from '@mui/icons-material';
import { Alert, Link } from '@mui/material';

export default function CheckoutError() {
  return (
    <Alert
      variant="outlined"
      severity="error"
      action={<Link href={SITE_URL}>Voltar à página principal.</Link>}
      icon={<SentimentDissatisfiedRounded />}
    >
      Tivemos um problema para carregar esta página.
    </Alert>
  );
}
