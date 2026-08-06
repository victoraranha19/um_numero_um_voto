'use client';

import { PAGAMENTO, PRESIDENTE } from '@lib/constants';
import { EMetodo } from '@lib/enums';
import { IReciboDetalhado } from '@lib/types';
import { CreditCardRounded, PixRounded } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from '@mui/material';

interface IRevisaoProps {
  recibo: IReciboDetalhado;
}

export default function Revisao({ recibo }: IRevisaoProps) {
  const pedido = recibo.pedido;

  function formatarData(data: string): string {
    const [a, m, d, h, M] = data.split(/[-T:]/);
    return `${d}/${m}/${a} ${h}:${M}`;
  }

  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'success.main' }}>
              +{pedido.quantidade}
            </Avatar>
          }
          title={<Typography variant="h6">Sobre o pedido</Typography>}
          subheader={
            <Typography variant="caption">
              {pedido.quantidade} voto(s) para {PRESIDENTE[pedido.presidente]}
            </Typography>
          }
        />
        <Divider />
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h5">
              R$ {(recibo.valor_total / 100).toFixed(2)}
            </Typography>
            <Typography variant="caption" gutterBottom>
              {formatarData(recibo.data_pagamento)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {recibo.metodo_pagamento === EMetodo.PIX ? (
                <PixRounded />
              ) : (
                <CreditCardRounded />
              )}
              <Typography>{PAGAMENTO[recibo.metodo_pagamento]}</Typography>
            </Box>
            <Typography>
              {recibo.metodo_pagamento === EMetodo.CREDITO
                ? recibo.parcelas + 'x (parcelas)'
                : ''}
            </Typography>
          </Box>
        </CardContent>
        <Divider />
        <CardActions>
          <Button onClick={() => window.open(recibo.url, '_blank')}>
            Comprovante InfinitePay
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
