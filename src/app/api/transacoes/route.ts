import db from '@api/db';
import { ITransacao } from '@lib/types';
import { NextResponse } from 'next/server';

import { EPapel, getEmailFromJWT } from '../usuario/usuario.utils';

const ALLOWED_ORIGIN = '*';

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

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
    const body = JSON.stringify(await request.json());
    await db`INSERT INTO testes (method, body)
      VALUES ('POST', ${body})`;
    // const body: IWebhookParams = await request.json();
    // await db.query(
    //   `UPDATE transacoes
    //   SET slug=$1, valor_pago=$3, parcelas=$4, metodo_pagamento=$5,
    //   nsu=$6, url_recibo=$7, foi_pago=$8, sucesso=TRUE, data_pagamento=$9
    //   WHERE order_nsu = $10`,
    //   [
    //     body.invoice_slug,
    //     body.paid_amount,
    //     body.installments,
    //     body.capture_method === 'credit_card' ? EMetodo.CREDITO : EMetodo.PIX,
    //     body.transaction_nsu,
    //     body.receipt_url,
    //     body.amount <= body.paid_amount,
    //     new Date(),
    //     body.order_nsu,
    //   ],
    // );
    return NextResponse.json([], {
      headers: { 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
      status: 200,
    });
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = JSON.stringify(await request.json());
    await db`INSERT INTO testes (method, body)
      VALUES ('PUT', ${body})`;
    return NextResponse.json([], {
      headers: { 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
      status: 200,
    });
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = JSON.stringify(await request.json());
    await db`INSERT INTO testes (method, body)
      VALUES ('PATCH', ${body})`;
    return NextResponse.json([], {
      headers: { 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
      status: 200,
    });
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
