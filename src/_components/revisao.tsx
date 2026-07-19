'use client';

import { Card, CardContent, Typography } from '@mui/material';

interface IRevisaoProps {
  order_nsu: string;
  receipt_url?: string | null;
  slug?: string | null;
  transaction_nsu?: string | null;
  capture_method?: string | null;
}

export default function Revisao({
  order_nsu,
  receipt_url = '',
  slug = '',
  transaction_nsu = '',
  capture_method = '',
}: IRevisaoProps) {
  return (
    <>
      <Card>
        <CardContent>
          <Typography>{order_nsu}</Typography>
          <Typography>{slug}</Typography>
          <Typography>{receipt_url}</Typography>
          <Typography>{transaction_nsu}</Typography>
          <Typography>{capture_method}</Typography>

          {/* <CotasList cotas={cotas} /> */}
        </CardContent>
      </Card>
    </>
  );
}
