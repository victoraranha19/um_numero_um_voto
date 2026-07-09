'use client';

import { Button, Typography } from '@mui/material';
import CotaForm from '@components/cota-form';
import { useState } from 'react';
import { EPresidente } from '@lib/types';

export default function RifaPage() {
  const [presidente, setPresidente] = useState(EPresidente.BOLSONARO);
  const [quantidade, setQuantidade] = useState(0);

  function handleVotar(q: number, p: EPresidente) {
    const url = new URL(window.location.href);
    url.searchParams.set('p', p);
    url.searchParams.set('q', q.toString());
    window.location.href = url.href;
  }

  return (
    <main>
      <Typography variant="h4" component="h1">
        Um número um voto
      </Typography>

      <CotaForm
        presidente={presidente}
        setPresidente={setPresidente}
        quantidade={quantidade}
        setQuantidade={setQuantidade}
      />

      <Button
        variant="contained"
        disabled={!quantidade}
        onClick={() => handleVotar(quantidade, presidente)}
      >
        Votar
      </Button>
    </main>
  );
}
