'use server';

import db from '@api/db';
import { IVotoConfirmado } from '@lib/types';

export async function verificarDonoRecibo(email: string, id_recibo: string) {
  try {
    const result = (await db`SELECT EXISTS
          (SELECT 1 FROM recibos r JOIN pedidos p ON p.id = r.id_pedido
          WHERE p.email_usuario = ${email} AND r.id = ${id_recibo})
          AS dono_pedido`) as { dono_pedido: boolean }[];
    return result[0].dono_pedido;
  } catch (error) {
    console.error('Erro ao verificar dono do pedido:', error);
    throw new Error('Erro ao verificar dono do pedido.');
  }
}

export async function verificarPedidoRecibo(id_pedido: string) {
  try {
    const result = (await db`SELECT EXISTS
      (SELECT 1 FROM pedidos p LEFT JOIN recibos r ON p.id = r.id_pedido
      WHERE p.id = ${id_pedido} AND r.id IS NOT NULL)
      AS possui_recibo
    `) as { possui_recibo: boolean }[];
    return result[0].possui_recibo;
  } catch (error) {
    console.error('Erro ao verificar pedido com recibo:', error);
    throw new Error('Erro ao verificar pedido com recibo.');
  }
}

export async function ultimos20Recibos(): Promise<IVotoConfirmado[]> {
  try {
    const results = (await db`SELECT
      r.data_pagamento, p.presidente, p.quantidade, u.nome
      FROM (SELECT data_pagamento, id_pedido FROM recibos ORDER BY data_pagamento DESC LIMIT 20) AS r
      JOIN pedidos p ON r.id_pedido = p.id
      JOIN usuarios u ON p.email_usuario = u.email
      ORDER BY data_pagamento DESC
    `) as IVotoConfirmado[];
    return results;
  } catch (error) {
    console.error('Erro ao buscar ultimos pagamentos confirmados:', error);
    throw new Error('Erro ao buscar ultimos pagamentos confirmados.');
  }
}
