import db from '@api/db';
import { EMetodo } from '@lib/enums';
import { IWebhookParams } from '@lib/types';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const {
      invoice_slug,
      paid_amount,
      installments,
      capture_method,
      transaction_nsu,
      receipt_url,
      amount,
      order_nsu,
    }: IWebhookParams = body;

    const metodo =
      capture_method === 'credit_card'
        ? EMetodo.CREDITO
        : capture_method === 'pix'
          ? EMetodo.PIX
          : EMetodo.APPLEPAY;

    await db`INSERT INTO recibos (id,url,codigo_fatura,metodo_pagamento,valor_total,valor_pago,parcelas,id_pedido)
      VALUES (${transaction_nsu},${receipt_url},${invoice_slug},${metodo},${amount},${paid_amount},${installments},${order_nsu})
      ON CONFLICT DO NOTHING`;

    return NextResponse.json([], { status: 200 });
  } catch (error) {
    console.error('Erro ao criar recibo:', error);
    await db`INSERT INTO requisicoes (body,error) VALUES (${JSON.stringify(body)},${JSON.stringify(error)})`;
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
