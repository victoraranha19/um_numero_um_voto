'use client';

import PresidenteForm from '@components/presidente-form';
import SelecaoRapida from '@components/selecao-rapida';
import { PRICE } from '@lib/constants';
import { EPresidente } from '@lib/enums';
import {
  KeyboardArrowRightRounded,
  LocalActivityRounded,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';

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
    <Container
      disableGutters
      sx={{ display: 'flex', justifyContent: 'center' }}
    >
      <Card sx={{ minWidth: 400, maxWidth: 700 }}>
        <CardContent sx={{ minHeight: 600 }}>
          <PresidenteForm
            presidente={presidente}
            setPresidente={setPresidente}
          />

          <Divider sx={{ my: 4 }} />

          <SelecaoRapida
            maximoSelecao={500}
            quantidadeSelecionada={quantidade}
            setQuantidadeSelecionada={setQuantidade}
          />
        </CardContent>

        <Divider />

        <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
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
                R$ {((PRICE * quantidade) / 100).toFixed(2).replace('.', ',')}
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
        </CardActions>
      </Card>
    </Container>
  );
}
