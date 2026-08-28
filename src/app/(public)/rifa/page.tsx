'use client';

import PresidenteForm from '@components/presidente-form';
import SelecaoRapida from '@components/selecao-rapida';
import {
  PRECO_ACIMA_1000,
  PRECO_ATE_100,
  PRECO_ATE_1000,
  PRECO_ATE_500,
} from '@lib/constants';
import { EPresidente } from '@lib/enums';
import {
  KeyboardArrowRightRounded,
  LocalActivityRounded,
} from '@mui/icons-material';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { useState } from 'react';

export default function RifaPage() {
  const [presidente, setPresidente] = useState(EPresidente.BOLSONARO);
  const [quantidade, setQuantidade] = useState(0);
  const total = getTotal(quantidade);

  function handleVotar(q: number, p: EPresidente) {
    const url = new URL(window.location.origin + '/checkout');
    url.searchParams.set('q', q.toString());
    url.searchParams.set('p', p);
    window.location.href = url.href;
  }

  function getTotal(quantidade: number) {
    if (quantidade <= 100) return PRECO_ATE_100 * quantidade;
    if (quantidade <= 500) return PRECO_ATE_500 * quantidade;
    if (quantidade <= 1000) return PRECO_ATE_1000 * quantidade;
    return PRECO_ACIMA_1000 * quantidade;
  }

  return (
    <>
      <PresidenteForm presidente={presidente} setPresidente={setPresidente} />

      <Divider sx={{ my: 4 }} />

      <SelecaoRapida
        maximoSelecao={100000}
        quantidadeSelecionada={quantidade}
        setQuantidadeSelecionada={setQuantidade}
      />

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              bgcolor: quantidade > 0 ? 'primary.main' : 'inherit',
              color: quantidade > 0 ? 'primary.contrastText' : 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
            }}
          >
            <LocalActivityRounded fontSize="large" />
          </Box>
          <Stack>
            {quantidade > 0 && (
              <Typography variant="caption">{quantidade} cotas</Typography>
            )}
            <Typography variant="h6">
              R$ {(total / 100).toFixed(2).replace('.', ',')}
            </Typography>
          </Stack>
        </Stack>

        <Button
          variant="contained"
          disabled={!quantidade}
          onClick={() => handleVotar(quantidade, presidente)}
          size="large"
        >
          Comprar
          <KeyboardArrowRightRounded fontSize="large" />
        </Button>
      </Box>
    </>
  );
}
