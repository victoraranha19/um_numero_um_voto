'use server';

import db from '@api/db';
import { EPresidente } from '@lib/enums';
import { IPedido } from '@lib/types';
import { verificarPedidoRecibo } from '../recibo/actions';

export async function getPedidoPendente(
  quantidade: number,
  presidente: EPresidente,
): Promise<IPedido[]> {
  try {
    const result =
      (await db`SELECT p.id, p.presidente, p.quantidade, p.valor, p.url, p.email_usuario
          FROM pedidos p LEFT JOIN recibos r ON p.id=r.id_pedido
          WHERE p.quantidade=${quantidade} AND p.presidente=${presidente} AND r.id IS NULL`) as IPedido[];
    return result;
  } catch (error) {
    console.error('Erro ao buscar pedido pendente:', error);
    throw new Error('Erro ao buscar pedido pendente');
  }
}

export async function criarPedido({
  url,
  presidente,
  valor,
  quantidade,
  email_usuario,
}: Omit<IPedido, 'id'>): Promise<string> {
  try {
    const result = (await db`INSERT INTO
      pedidos (url, presidente, valor, quantidade, email_usuario)
      VALUES (${url}, ${presidente}, ${valor}, ${quantidade}, ${email_usuario})
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
    const possuiRecibo = await verificarPedidoRecibo(id);
    if (possuiRecibo) {
      throw new Error('Não é possível deletar pedido que já processado.');
    }
    await db`DELETE FROM pedidos WHERE id=${id}`;
  } catch (error) {
    console.error('Erro ao deletar pedido de compra:', error);
    throw new Error('Erro ao deletar pedido de compra.');
  }
}
