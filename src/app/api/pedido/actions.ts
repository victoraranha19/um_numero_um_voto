'use server';

import db from '@api/db';
import { EPresidente } from '@lib/enums';
import { IPedido, IPedidoCriacao } from '@lib/types';

export async function getPedidoPendente(
  quantidade: number,
  presidente: EPresidente,
  email: string,
): Promise<IPedido> {
  try {
    const result = (await db`SELECT * FROM pedidos
          WHERE email = ${email} AND quantidade=${quantidade} AND presidente=${presidente} AND recibo_id IS NULL`) as IPedido[];
    return result[0];
  } catch (error) {
    console.error('Erro ao buscar pedido pendente:', error);
    throw new Error('Erro ao buscar pedido pendente');
  }
}

export async function getPedidoByRecibo(
  recibo_id: string,
  email: string,
): Promise<IPedido> {
  try {
    const result = (await db`SELECT * FROM pedidos
          WHERE email = ${email} AND recibo_id = ${recibo_id}`) as IPedido[];
    return result[0];
  } catch (error) {
    console.error('Erro ao buscar pedido por id de recibo:', error);
    throw new Error('Erro ao buscar pedido por id de recibo');
  }
}

export async function criarPedido({
  presidente,
  valor,
  quantidade,
  email_usuario,
}: IPedidoCriacao): Promise<string> {
  try {
    const result = (await db`INSERT INTO
      pedidos (presidente, valor, quantidade, email_usuario)
      VALUES (${presidente}, ${valor}, ${quantidade}, ${email_usuario})
      RETURNING id`) as { id: string }[];
    return result[0].id;
  } catch (error) {
    console.error('Erro ao criar pedido de compra:', error);
    throw new Error('Erro ao criar pedido de compra.');
  }
}

export async function salvarUrlPedido(id: string, url: string): Promise<void> {
  try {
    await db`UPDATE pedidos 
    SET url = ${url}
    WHERE id = ${id}`;
  } catch (error) {
    console.error('Erro ao salvar url do pedido:', error);
    throw new Error('Erro ao salvar url do pedido.');
  }
}

export async function deletarPedido(id: string): Promise<void> {
  try {
    const result = (await db`SELECT recibo_id FROM pedidos WHERE id=${id}`) as {
      recibo_id: string | null;
    }[];
    if (result[0].recibo_id && result[0].recibo_id.length) {
      throw new Error('Não é possível deletar pedido que já processado.');
    }
    await db`DELETE FROM pedidos WHERE id=${id}`;
  } catch (error) {
    console.error('Erro ao deletar pedido de compra:', error);
    throw new Error('Erro ao deletar pedido de compra.');
  }
}
