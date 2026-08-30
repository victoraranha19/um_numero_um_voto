'use server';

import { gerarURLInfinitePay } from '@api/actions';
import db from '@api/db';
import { EPresidente } from '@lib/enums';
import {
  IPedido,
  IPedidoCriacao,
  IUsuario,
  IVotoConfirmado,
  IVotoPresidente,
} from '@lib/types';
import { getPayload, getValorCotas } from '@lib/utils';

export async function getURLPedidoPendente(
  quantidade: number,
  presidente: EPresidente,
  usuario: IUsuario,
): Promise<string> {
  try {
    // Se ja existe url pro infinitepay
    const result = (await db`SELECT url FROM pedidos
          WHERE email=${usuario.email} AND quantidade=${quantidade} AND presidente=${presidente} AND recibo_id IS NULL`) as {
      url: string;
    }[];
    const url = result[0].url;
    if (url.length) return url;

    // Se nao existe url pro infinitepay
    const id = await criarPedido({
      email_usuario: usuario.email,
      presidente,
      quantidade,
      valor: getValorCotas(quantidade),
    });
    const payload = getPayload(presidente, quantidade, usuario, id);
    const urlNova = await gerarURLInfinitePay(payload);

    return await salvarUrlPedido(id, urlNova);
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
    console.error(
      `Erro ao buscar pedido de ${email} por id de recibo ${recibo_id}:`,
      error,
    );
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

export async function salvarUrlPedido(
  id: string,
  url: string,
): Promise<string> {
  try {
    const result = (await db`UPDATE pedidos 
    SET url = ${url}
    WHERE id = ${id}
    RETURNING url`) as { url: string }[];
    return result[0].url;
  } catch (error) {
    console.error('Erro ao salvar url do pedido:', error);
    throw new Error('Erro ao salvar url do pedido.');
  }
}

export async function deletarPedido(id: string): Promise<void> {
  try {
    const result = await existeReciboCadastrado(id);
    if (result) throw new Error('Pedido já pago.');
    await db`DELETE FROM pedidos WHERE id=${id}`;
  } catch (error) {
    console.error('Erro ao deletar pedido de compra:', error);
    throw new Error('Erro ao deletar pedido de compra.');
  }
}

export async function existeReciboCadastrado(id: string): Promise<boolean> {
  try {
    const result = (await db`SELECT recibo_id FROM pedidos WHERE id=${id}`) as {
      recibo_id: string | null;
    }[];
    return !!result[0].recibo_id && result[0].recibo_id.length > 0;
  } catch (error) {
    console.error('Erro ao verificar recibo:', error);
    throw new Error('Erro ao verificar recibo.');
  }
}

export async function ultimas20Compras(): Promise<IVotoConfirmado[]> {
  try {
    const result = (await db`
      WITH ultimos AS (
        SELECT * FROM pedidos
        WHERE recibo_id IS NOT NULL
        LIMIT 20
      )
      SELECT u.nome, up.quantidade, up.presidente, up.data_pago
      FROM ultimos up JOIN usuarios u ON up.email_usuario = u.email
      ORDER BY up.data_pago DESC`) as IVotoConfirmado[];
    return result;
  } catch (error) {
    console.error('Erro ao buscar compras:', error);
    throw new Error('Erro ao buscar compras.');
  }
}

export async function getTotalPresidente(): Promise<IVotoPresidente[]> {
  try {
    const result = (await db`
      WITH recibos AS (
        SELECT presidente, quantidade
        FROM pedidos
        WHERE recibo_id IS NOT NULL
      )
      SELECT presidente, sum(quantidade) AS total
      FROM recibos
      GROUP BY presidente`) as IVotoPresidente[];
    return result;
  } catch (error) {
    console.error('Erro ao buscar votos totais:', error);
    throw new Error('Erro ao buscar votos totais.');
  }
}
