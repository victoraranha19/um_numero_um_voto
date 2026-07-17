'use server';

import db from '@api/db';
import { ITransacaoNova } from '@lib/types';

export async function verificarPedidosUsuario(email: string): Promise<number> {
  try {
    const result = await db.query<{ count: number }>(
      'SELECT COUNT(*) FROM transacoes WHERE email_usuario = $1',
      [email],
    );
    return result.rows[0].count;
  } catch (error) {
    console.error('Erro ao verificar pedidos do usuário:', error);
    throw new Error('Erro ao verificar pedidos do usuário');
  }
}

export async function verificarUrlPagamento(
  url_pagamento: string,
): Promise<number> {
  try {
    const result = await db.query<{ count: number }>(
      'SELECT COUNT(*) FROM transacoes WHERE url_pagamento = $1',
      [url_pagamento],
    );
    return result.rows[0].count;
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
