'use server';

import { ICota, IPayload } from '@lib/types';
import db from './db';

export async function criarCota(cota: ICota): Promise<ICota | null> {
  try {
    await db.query(
      `INSERT INTO cotas (numero,id_transacao) 
      VALUES ($1, $2)`,
      [cota.numero, cota.id_transacao],
    );
    return null;
  } catch (error) {
    console.error('Erro ao criar cota:', error);
    return cota;
  }
}

export async function getCotasDisponiveis(
  pagina = 1,
  itens_por_pagina = 500,
): Promise<number[]> {
  try {
    const primeiroItem = (pagina - 1) * itens_por_pagina + 1;
    const ultimoItem = primeiroItem + itens_por_pagina;
    const result = (await db`SELECT numero FROM cotas
      WHERE id_transacao IS NULL AND numero >= ${primeiroItem} AND numero < ${ultimoItem}
      ORDER BY numero ASC`) as { numero: number }[];
    return result.map((v) => v.numero);
  } catch (error) {
    console.error('Erro ao buscar cotas:', error);
    return [];
  }
}

export async function getCotasCompradas(
  pagina = 1,
  itens_por_pagina = 500,
): Promise<number[]> {
  try {
    const primeiroItem = (pagina - 1) * itens_por_pagina + 1;
    const ultimoItem = primeiroItem + itens_por_pagina;
    const result = (await db`SELECT numero FROM cotas
      WHERE id_transacao IS NOT NULL AND numero >= ${primeiroItem} AND numero < ${ultimoItem}
      ORDER BY numero ASC`) as { numero: number }[];
    return result.map((v) => v.numero);
  } catch (error) {
    console.error('Erro ao buscar cotas:', error);
    return [];
  }
}

export async function getURLPagamento(payload: IPayload): Promise<string> {
  const response: { url: string } = await fetch(
    'https://api.checkout.infinitepay.io/links',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    },
  ).then((v) => v.json());
  return response.url;
}
