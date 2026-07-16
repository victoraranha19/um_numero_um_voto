'use server';

import { ICota, IPayload } from '@lib/types';
import db from './db';

export async function criarCota(cota: ICota): Promise<ICota | null> {
  try {
    await db.query(
      `INSERT INTO cotas (numero,presidente,id_transacao) 
      VALUES ($1, $2, $3)`,
      [cota.numero, cota.presidente, cota.id_transacao],
    );
    return null;
  } catch (error) {
    console.error('Erro ao criar cota:', error);
    return cota;
  }
}

export async function getNumeroCotasDisponiveis(): Promise<number> {
  try {
    const result = await db.query<{ count: number }>(
      `SELECT COUNT(*) FROM cotas WHERE id_transacao IS NULL`,
    );
    return result.rows[0].count;
  } catch (error) {
    console.error('Erro ao buscar quantidade de cotas disponíveis:', error);
    return 0;
  }
}

export async function getCotasDisponiveis(
  pagina = 1,
  itens_por_pagina = 500,
): Promise<number[]> {
  try {
    const primeiroItem = (pagina - 1) * itens_por_pagina + 1;
    const ultimoItem = primeiroItem + itens_por_pagina;
    const result = await db.query<{ numero: number }>(
      `SELECT numero FROM cotas
      WHERE id_transacao IS NULL AND numero >= $1 AND numero < $2
      ORDER BY numero ASC`,
      [primeiroItem, ultimoItem],
    );
    return result.rows.map((v) => v.numero);
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
    const result = await db.query<{ numero: number }>(
      `SELECT numero FROM cotas
      WHERE id_transacao IS NOT NULL AND numero >= $1 AND numero < $2
      ORDER BY numero ASC`,
      [primeiroItem, ultimoItem],
    );
    return result.rows.map((v) => v.numero);
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
