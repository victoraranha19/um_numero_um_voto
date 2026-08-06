import db from '@api/db';
import { IPedidoDetalhado } from '@lib/types';
import { getEmailFromRequest, toPedidoDetalhado } from '@lib/utils';
import { NextResponse } from 'next/server';
import { verificarAcessoAdmin } from '../usuario/actions';
import { EMetodo, EPresidente } from '@lib/enums';

export async function GET(request: Request): Promise<Response> {
  try {
    // Verifica autenticação do usuário
    const emailProprio = getEmailFromRequest(request.headers);

    // Verifica se exite parâmetro email na url
    const { searchParams } = new URL(request.url);
    const emailPesquisado = searchParams.get('email');

    if (!emailPesquisado) {
      // Retorna proprio email
      const result =
        (await db`SELECT p.id as pedido_id, p.presidente, p.quantidade, p.valor, p.url AS pedido_url, p.email_usuario,
        r.id as recibo_id, r.data_pagamento, r.url AS recibo_url, r.codigo_fatura, r.metodo_pagamento, r.valor_total, r.valor_pago, r.parcelas
        FROM pedidos p LEFT JOIN recibos r ON p.id = r.id_pedido
        WHERE email_usuario = ${emailProprio}`) as IPedidoRecibo[];
      return NextResponse.json(
        result.map<IPedidoDetalhado>((pedidoRecibo) =>
          toPedidoDetalhado(pedidoRecibo),
        ),
      );
    }

    if (emailPesquisado !== emailProprio) {
      // Verifica se o usuário é admin
      const administrador = await verificarAcessoAdmin(emailProprio);
      if (!administrador) return NextResponse.json([], { status: 401 });
    }

    // Retorna email pesquisado
    const result =
      (await db`SELECT p.id as pedido_id, p.presidente, p.quantidade, p.valor, p.url AS pedido_url, p.email_usuario,
        r.id as recibo_id, r.data_pagamento, r.url AS recibo_url, r.codigo_fatura, r.metodo_pagamento, r.valor_total, r.valor_pago, r.parcelas
        FROM pedidos p LEFT JOIN recibos r ON p.id = r.id_pedido
        WHERE email_usuario = ${emailPesquisado}`) as IPedidoRecibo[];
    return NextResponse.json(
      result.map<IPedidoDetalhado>((pedidoRecibo) =>
        toPedidoDetalhado(pedidoRecibo),
      ),
    );
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    return NextResponse.json([], { status: 400 });
  }
}

interface IPedidoRecibo {
  pedido_id: string;
  presidente: EPresidente;
  quantidade: number;
  pedido_url: string;
  valor: number;
  email_usuario: string;

  recibo_id: string | null;
  data_pagamento: Date | null;
  recibo_url: string | null;
  codigo_fatura: string | null;
  metodo_pagamento: EMetodo | null;
  valor_total: number | null;
  valor_pago: number | null;
  parcelas: number | null;
}
