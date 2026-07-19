'use server';

import db from '@api/db';
import { ITransacaoNova } from '@lib/types';

export async function getQuantidadePedidosUsuario(
  email: string,
): Promise<number> {
  try {
    const result = (await db`SELECT COUNT(*)
      FROM transacoes WHERE email_usuario = ${email}`) as { count: string }[];
    return parseInt(result[0].count);
  } catch (error) {
    console.error('Erro ao verificar pedidos do usuário:', error);
    throw new Error('Erro ao verificar pedidos do usuário');
  }
}

export async function getUrlPagamentoPedidoPendente(
  quantidade: number,
): Promise<string> {
  try {
    const result = (await db`SELECT url_pagamento
      FROM transacoes
      WHERE quantidade = ${quantidade} AND foi_pago = FALSE`) as {
      url_pagamento: string;
    }[];
    return result.at(0)?.url_pagamento ?? '';
  } catch (error) {
    console.error('Erro ao verificar pedidos com url_pagamento:', error);
    throw new Error('Erro ao verificar pedidos com url_pagamento');
  }
}

export async function criarPedido({
  order_nsu,
  url_pagamento,
  presidente,
  valor_total,
  quantidade,
  email_usuario,
}: ITransacaoNova): Promise<void> {
  try {
    await db`INSERT INTO
      transacoes (order_nsu, url_pagamento, presidente, valor_total, quantidade, email_usuario)
      VALUES (${order_nsu}, ${url_pagamento}, ${presidente}, ${valor_total}, ${quantidade}, ${email_usuario})`;
  } catch (error) {
    console.error('Erro ao criar pedido de compra:', error);
    throw new Error('Erro ao criar pedido de compra.');
  }
}
