import db from '@api/db';
import { IPedido, IWebhookParams } from '@lib/types';
import { getEmailFromRequest } from '@lib/utils';
import { NextResponse } from 'next/server';
import { verificarAcessoAdmin } from '../usuario/actions';
import { EMetodo } from '@lib/enums';
import { registrarErro } from '../server_bug/actions';

export async function GET(request: Request): Promise<Response> {
  try {
    // Verifica autenticação do usuário
    const emailProprio = await getEmailFromRequest(request.headers);
    if (!emailProprio) return NextResponse.json([], { status: 403 });

    // Verifica se exite parâmetro email na url
    const { searchParams } = new URL(request.url);
    const emailPesquisado = searchParams.get('email');

    if (!emailPesquisado) {
      // Retorna proprio email
      const result = (await db`SELECT * FROM pedidos
        WHERE email_usuario = ${emailProprio}`) as IPedido[];
      return NextResponse.json(result);
    }

    if (emailPesquisado !== emailProprio) {
      // Verifica se o usuário é admin
      const administrador = await verificarAcessoAdmin(emailProprio);
      if (!administrador) return NextResponse.json([], { status: 401 });
    }

    // Retorna email pesquisado
    const result = (await db`SELECT * FROM pedidos
        WHERE email_usuario = ${emailPesquisado}`) as IPedido[];
    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    return NextResponse.json([], { status: 400 });
  }
}

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

    await db`
      WITH cotas_reservadas AS (
        SELECT numero
        FROM cotas_disponiveis
        ORDER BY random()
        FOR UPDATE SKIP LOCKED
      ),
      cotas_removidas AS (
        DELETE FROM cotas_disponiveis 
        WHERE numero IN (SELECT numero FROM cotas_reservadas)
        RETURNING numero
      ),
      UPDATE pedidos SET
      recibo_id = ${transaction_nsu},
      data_pago = ${new Date()},
      url = ${receipt_url},
      cod_fatura = ${invoice_slug},
      metodo = ${metodo},
      valor_total = ${amount},
      valor_pago = ${paid_amount},
      parcelas = ${installments},
      cotas = array_agg(numero)      
      WHERE id = ${order_nsu}`;

    return NextResponse.json([], { status: 200 });
  } catch (error) {
    console.error('Erro ao criar recibo:', error);
    await registrarErro(JSON.stringify(body), JSON.stringify(error));
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
