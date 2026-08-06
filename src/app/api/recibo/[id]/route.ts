import { getEmailFromRequest, toReciboDetalhado } from '@lib/utils';
import { NextRequest, NextResponse } from 'next/server';
import db from '@api/db';
import { IReciboDetalhado, IReciboPedido } from '@lib/types';
import { verificarDonoRecibo } from '../actions';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext,
): Promise<Response> {
  try {
    // Verifica autenticação do usuário
    const emailProprio = getEmailFromRequest(request.headers);

    const { id } = await context.params;
    if (emailProprio) {
      // Verifica se o usuário é dono do pedido
      const donoPedido = await verificarDonoRecibo(emailProprio, id);
      if (!donoPedido) throw new Error('Não autorizado!');
    }

    // Retorna email pesquisado
    const result =
      (await db`SELECT p.id as pedido_id, p.presidente, p.quantidade, p.valor, p.url AS pedido_url, p.email_usuario,
        r.id as recibo_id, r.data_pagamento, r.url AS recibo_url, r.codigo_fatura, r.metodo_pagamento, r.valor_total, r.valor_pago, r.parcelas
        FROM pedidos p RIGHT JOIN recibos r ON p.id = r.id_pedido
        WHERE p.email_usuario = ${emailProprio} AND r.id = ${id}`) as IReciboPedido[];
    return NextResponse.json(
      result.map<IReciboDetalhado>((reciboPedido) =>
        toReciboDetalhado(reciboPedido),
      ),
    );
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    return NextResponse.json([], { status: 400 });
  }
}
