'use server';

import db from '@api/db';
import { IPayload, ITransacaoNova } from '@lib/types';

export async function getQuantidadePedidosUsuario(
  email: string,
): Promise<number> {
  try {
    const result = await db.query<{ count: string }>(
      'SELECT COUNT(*) FROM transacoes WHERE email_usuario = $1',
      [email],
    );
    return parseInt(result.rows[0].count);
  } catch (error) {
    console.error('Erro ao verificar pedidos do usuário:', error);
    throw new Error('Erro ao verificar pedidos do usuário');
  }
}

export async function getUrlPagamentoPedidoPendente(
  payload: IPayload,
): Promise<string> {
  try {
    const result = await db.query<{ url_pagamento: string }>(
      'SELECT url_pagamento FROM transacoes WHERE quantidade = $1 AND foi_pago = FALSE',
      [payload.items[0].quantity],
    );
    return result.rows[0].url_pagamento ?? '';
  } catch (error) {
    console.error('Erro ao verificar pedidos com url_pagamento:', error);
    throw new Error('Erro ao verificar pedidos com url_pagamento');
  }
}

export async function criarPedido(transacao: ITransacaoNova): Promise<void> {
  try {
    await db.query(
      `INSERT INTO
      transacoes (order_nsu, url_pagamento, valor_total, quantidade, email_usuario)
      VALUES ($1, $2, $3, $4, $5)`,
      [
        transacao.order_nsu,
        transacao.url_pagamento,
        transacao.valor_total,
        transacao.quantidade,
        transacao.email_usuario,
      ],
    );
  } catch (error) {
    console.error('Erro ao criar pedido de compra:', error);
    throw new Error('Erro ao criar pedido de compra.');
  }
}
