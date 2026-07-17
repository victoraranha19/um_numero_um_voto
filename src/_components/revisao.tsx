'use client';

import { ICota, ITransacao } from '@lib/types';
import { Card, CardContent, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import CotasList from './cotas-list';

interface IRevisaoProps {
  pedido: ITransacao;
}

export default function Revisao({ pedido }: IRevisaoProps) {
  const [cotas, setCotas] = useState<ICota[]>([]);

  useEffect(() => {
    const url = new URL('/api/cotas');
    url.searchParams.set('id', pedido.order_nsu);
    fetch(url, { method: 'GET' })
      .then((r) => r.json())
      .then((c: ICota[]) => setCotas(c));
  }, [pedido]);

  return (
    <>
      <Card>
        <CardContent>
          <Typography>{pedido.order_nsu}</Typography>
          <Typography>{pedido.sucesso}</Typography>
          <Typography>{pedido.valor_total}</Typography>
          <Typography>{pedido.foi_pago}</Typography>
          <Typography>{pedido.valor_pago}</Typography>
          <Typography>{pedido.metodo_pagamento}</Typography>
          <Typography>{pedido.parcelas}</Typography>
          <Typography>{pedido.quantidade}</Typography>
          <Typography>{pedido.slug}</Typography>
          <Typography>{pedido.transaction_nsu}</Typography>
          <Typography>{pedido.url_recibo}</Typography>

          <CotasList cotas={cotas} />
        </CardContent>
      </Card>
    </>
  );
}
