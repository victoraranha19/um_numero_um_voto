import db from '@api/db';
import { EMetodo, ITransacao } from '@lib/types';
import { NextResponse } from 'next/server';
import { IWebhookParams } from './transacoes.utils';
import { EPapel, getEmailFromJWT } from '../usuario/usuario.utils';

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
      const result = await db.query<ITransacao>(
        'SELECT * FROM transacoes WHERE email = $1',
        [emailProprio],
      );
      return NextResponse.json(result.rows);
    }

    // Verifica se o usuário é dono do pedido ou admin
    const dono_pedido = (
      await db.query<{ dono_pedido: boolean }>(
        'SELECT EXISTS (SELECT 1 FROM usuarios JOIN transacoes ON email = email_usuario WHERE email = $1 AND order_nsu = $2) as dono_pedido',
        [emailProprio, order_nsu],
      )
    ).rows[0].dono_pedido;
    const administrador = (
      await db.query<{ admin: boolean }>(
        'SELECT EXISTS (SELECT 1 FROM usuarios WHERE email = $1 AND papel = $2) as admin',
        [emailProprio, EPapel.ADMIN],
      )
    ).rows[0].admin;
    if (!administrador && !dono_pedido) throw new Error('Não autorizado!');

    // Retorna pedido pesquisado
    const result = await db.query<ITransacao>(
      'SELECT * FROM transacoes WHERE order_nsu = $1',
      [order_nsu],
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    return NextResponse.json([], { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const body = JSON.stringify(await request.json());
    await db.query(
      `INSERT INTO testes (method, body)
      VALUE ('POST', $1)`,
      [body],
    );
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
    return NextResponse.json([], { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = JSON.stringify(await request.json());
    await db.query(
      `INSERT INTO testes (method, body)
      VALUE ('PUT', $1)`,
      [body],
    );
    return NextResponse.json([], { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = JSON.stringify(await request.json());
    await db.query(
      `INSERT INTO testes (method, body)
      VALUE ('PATCH', $1)`,
      [body],
    );
    return NextResponse.json([], { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
