'use server';

import db from '@api/db';
import { ITransacaoNova } from '@lib/types';
import { revalidatePath } from 'next/cache';

export async function verificarPedidosUsuario(email: string): Promise<number> {
  try {
    const result = await db.query<{ count: number }>(
      'SELECT COUNT(*) FROM transacoes WHERE email = $1',
      [email],
    );
    return result.rows[0].count;
  } catch (error) {
    console.error('Erro ao verificar pedidos do usuário:', error);
    throw new Error('Erro ao verificar pedidos do usuário');
  }
}

export async function criarPedido(transacao: ITransacaoNova): Promise<void> {
  try {
    await db.query(
      `INSERT INTO
      transacoes (order_nsu, url_pagamento, valor_total, quantidade, email_usuario)
      VALUES ($1, $2, $3, $4)`,
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
  // Revalida a rota raiz para atualizar os dados
  revalidatePath('/');
}
