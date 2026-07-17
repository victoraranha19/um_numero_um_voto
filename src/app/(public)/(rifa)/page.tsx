'use client';

import { Button, Card, CardActions, CardContent } from '@mui/material';
import CotaForm from '@components/cota-form';
import { useState } from 'react';
import { EPresidente } from '@lib/types';

export default function RifaPage() {
  const [presidente, setPresidente] = useState(EPresidente.BOLSONARO);
  const [quantidade, setQuantidade] = useState(0);

  function handleVotar(q: number, p: EPresidente) {
    const url = new URL(window.location.href + '/checkout');
    url.searchParams.set('p', p);
    url.searchParams.set('q', q.toString());
    window.location.href = url.href;
  }

  return (
    <main>
      <Card>
        <CardContent>
          <CotaForm
            presidente={presidente}
            setPresidente={setPresidente}
            quantidade={quantidade}
            setQuantidade={setQuantidade}
          />
        </CardContent>

        <CardActions>
          <Button
            variant="contained"
            disabled={!quantidade}
            onClick={() => handleVotar(quantidade, presidente)}
          >
            Votar
          </Button>
        </CardActions>
      </Card>
    </main>
  );
}
