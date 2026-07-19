import db from '@api/db';
import { EMetodo, ITransacao } from '@lib/types';
import { NextResponse } from 'next/server';

import { EPapel, getEmailFromJWT } from '../usuario/usuario.utils';
import { IWebhookParams } from './transacoes.utils';

export async function GET(request: Request) {
  try {
    // Verifica autenticação do usuário
    const cookie = request.headers.get('Cookie');
    if (!cookie) throw new Error('Não autenticado! Cookie não encontrado.');
    const emailProprio = getEmailFromJWT(cookie);

    // Verifica se exite parâmetro id na url
    const { searchParams } = new URL(request.url);
    const order_nsu = searchParams.get('id');

    if (!order_nsu) {
      // Retorna todos os pedidos do usuário
      const result =
        (await db`SELECT * FROM transacoes WHERE email = ${emailProprio}`) as ITransacao[];
      return NextResponse.json(result);
    }

    // Verifica se o usuário é dono do pedido ou admin
    const dono_pedido = (
      (await db`SELECT EXISTS
        (SELECT 1 FROM usuarios JOIN transacoes ON email = email_usuario
        WHERE email = ${emailProprio} AND order_nsu = ${order_nsu})
        as dono_pedido`) as { dono_pedido: boolean }[]
    )[0].dono_pedido;
    const administrador = (
      (await db`SELECT EXISTS
        (SELECT 1 FROM usuarios WHERE email = ${emailProprio} AND papel = ${EPapel.ADMIN})
        as admin`) as { admin: boolean }[]
    )[0].admin;
    if (!administrador && !dono_pedido) throw new Error('Não autorizado!');

    // Retorna pedido pesquisado
    const result =
      (await db`SELECT * FROM transacoes WHERE order_nsu = ${order_nsu}`) as ITransacao[];
    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    return NextResponse.json([], { status: 400 });
  }
}

export async function POST(request: Request) {
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
    }: IWebhookParams = await request.json();

    const metodo_pagamento =
      capture_method === 'credit_card'
        ? EMetodo.CREDITO
        : capture_method === 'pix'
          ? EMetodo.PIX
          : EMetodo.APPLEPAY;
    const foi_pago = amount <= paid_amount;

    await db`UPDATE transacoes
      SET slug=${invoice_slug}, valor_pago=${paid_amount}, parcelas=${installments}, metodo_pagamento=${metodo_pagamento},
      nsu=${transaction_nsu}, url_recibo=${receipt_url}, foi_pago=${foi_pago}, sucesso=TRUE, data_pagamento=$${new Date()}
      WHERE order_nsu = ${order_nsu}`;

    return NextResponse.json([], { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
