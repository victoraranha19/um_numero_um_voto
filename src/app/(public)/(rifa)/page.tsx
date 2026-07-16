'use client';

import { Button, Card, CardActions, CardContent } from '@mui/material';
import CotaForm from '@components/cota-form';
import { useEffect, useState } from 'react';
import { EPresidente } from '@lib/types';
import {
  getCotasCompradas,
  getCotasDisponiveis,
  getNumeroCotasDisponiveis,
} from '@api/actions';

export default function RifaPage() {
  const [presidente, setPresidente] = useState(EPresidente.BOLSONARO);
  const [quantidade, setQuantidade] = useState(0);
  const [cotasDisponiveis, setCotasDisponiveis] = useState<number[]>([]);

  function handleVotar(q: number, p: EPresidente) {
    const url = new URL(window.location.href + '/checkout');
    url.searchParams.set('p', p);
    url.searchParams.set('q', q.toString());
    window.location.href = url.href;
  }

  useEffect(() => {
    getNumeroCotasDisponiveis().then((n) => {
      if (n < 500 / 2) {
        getCotasDisponiveis().then((cotas) => setCotasDisponiveis(cotas));
      } else {
        getCotasCompradas().then((cotas) => {
          const cotasComp = new Set<number>(cotas);
          const cotasDisp = Array.from({ length: 500 }, (_, i) => i + 1).filter(
            (c) => !cotasComp.has(c),
          );
          setCotasDisponiveis(cotasDisp);
        });
      }
    });
  }, [setCotasDisponiveis]);

  return (
    <main>
      <Card>
        <CardContent>
          <CotaForm
            cotasDisponiveis={cotasDisponiveis}
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
