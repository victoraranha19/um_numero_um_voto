'use client';

import { IReciboDetalhado } from '@lib/types';
import { Card, CardContent, Typography } from '@mui/material';

interface IRevisaoProps {
  recibo: IReciboDetalhado;
}

export default function Revisao({ recibo }: IRevisaoProps) {
  const pedido = recibo.pedido;
  return (
    <>
      <Card>
        <CardContent>
          <Typography>{pedido.presidente}</Typography>
          <Typography>{pedido.quantidade}</Typography>
          <Typography>{pedido.valor}</Typography>

          <Typography>{recibo.id}</Typography>
          <Typography>{recibo.codigo_fatura}</Typography>
          <Typography>{recibo.data_pagamento.toLocaleString()}</Typography>
          <Typography>{recibo.metodo_pagamento}</Typography>
          <Typography>{recibo.parcelas}</Typography>
          <Typography>{recibo.url}</Typography>
          <Typography>{recibo.valor_pago}</Typography>
          <Typography>{recibo.valor_total}</Typography>
        </CardContent>
      </Card>
    </>
  );
}
