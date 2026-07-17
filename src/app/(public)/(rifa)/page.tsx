'use client';

import { useState } from 'react';
import CotaForm from '@components/cota-form';
import { EPresidente } from '@lib/types';
import { Button, Card, CardActions, CardContent } from '@mui/material';

export default function RifaPage() {
  const [presidente, setPresidente] = useState(EPresidente.BOLSONARO);
  const [quantidade, setQuantidade] = useState(0);

  function handleVotar(q: number, p: EPresidente) {
    const url = new URL(window.location.href + '/checkout');
    url.searchParams.set('q', q.toString());
    url.searchParams.set('p', p);
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
