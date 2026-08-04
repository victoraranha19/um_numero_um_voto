'use server';

import db from '@api/db';
import { EPresidente } from '@lib/enums';
import { IPedido } from '@lib/types';

export async function verificarDonoPedido(email: string, order_nsu: string) {
  try {
    const result = (await db`SELECT EXISTS
          (SELECT 1 FROM usuarios JOIN pedidos ON email = email_usuario
          WHERE email = ${email} AND order_nsu = ${order_nsu})
          AS dono_pedido`) as { dono_pedido: boolean }[];
    return result[0].dono_pedido;
  } catch (error) {
    console.error('Erro ao verificar dono do pedido:', error);
    throw new Error('Erro ao verificar dono do pedido.');
  }
}

export async function getQuantidadePedidosUsuario(
  email: string,
): Promise<number> {
  try {
    const result = (await db`SELECT COUNT(*)
          FROM pedidos WHERE email_usuario = ${email}`) as {
      count: string;
    }[];
    return parseInt(result[0].count);
  } catch (error) {
    console.error('Erro ao verificar pedidos do usuário:', error);
    throw new Error('Erro ao verificar pedidos do usuário');
  }
}

export async function getUrlPagamentoPedidoPendente(
  quantidade: number,
  presidente: EPresidente,
): Promise<string> {
  try {
    const result = (await db`SELECT p.url
          FROM pedidos p LEFT JOIN recibos r ON p.id=r.id_pedido
          WHERE p.quantidade=${quantidade} AND p.presidente=${presidente} AND r.id IS NULL`) as {
      url: string;
    }[];
    return result.at(0)?.url ?? '';
  } catch (error) {
    console.error('Erro ao verificar pedidos com url:', error);
    throw new Error('Erro ao verificar pedidos com url');
  }
}

export async function criarPedido({
  id,
  url,
  presidente,
  valor,
  quantidade,
  email_usuario,
}: IPedido): Promise<void> {
  try {
    await db`INSERT INTO
      pedidos (id, url, presidente, valor, quantidade, email_usuario)
      VALUES (${id}, ${url}, ${presidente}, ${valor}, ${quantidade}, ${email_usuario})`;
  } catch (error) {
    console.error('Erro ao criar pedido de compra:', error);
    throw new Error('Erro ao criar pedido de compra.');
  }
}
