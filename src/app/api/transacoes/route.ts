import db from '@api/db';
import { EMetodo, IItem } from '@lib/types';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body: IWebhookParams = await request.json();

  try {
    await db.query(
      `UPDATE transacoes 
      SET slug=$1, valor_pago=$3, parcelas=$4, metodo_pagamento=$5,
      nsu=$6, url_recibo=$7, foi_pago=$8, sucesso=TRUE, data_pagamento=$9
      WHERE order_nsu = $10`,
      [
        body.invoice_slug,
        body.paid_amount,
        body.installments,
        body.capture_method === 'credit_card' ? EMetodo.CREDITO : EMetodo.PIX,
        body.transaction_nsu,
        body.receipt_url,
        body.amount <= body.paid_amount,
        new Date(),
        body.order_nsu,
      ],
    );
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  return NextResponse.json([], { status: 200 });
}

interface IWebhookParams {
  invoice_slug: string;
  amount: number;
  paid_amount: number;
  installments: number;
  capture_method: string;
  transaction_nsu: string;
  order_nsu: string;
  receipt_url: string;
  items: IItem[];
}
