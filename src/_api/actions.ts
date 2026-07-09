'use server';

import { ICotaList, IPayload } from '@lib/types';
import db from './db';

export async function getCotas(de: number, ate: number): Promise<ICotaList[]> {
  try {
    if (de > ate) throw new Error('Range de busca inválido.');
    const result = await db.query<ICotaList>(
      `SELECT numero, foi_pago, sucesso, presidente
      FROM transacoes JOIN cotas
      ON transacoes.nsu = cotas.id_transacao
      WHERE numero >= $1 AND numero <= $2
      ORDER BY numero ASC;`,
      [de, ate],
    );
    return result.rows;
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
  console.log(response.url);
  return response.url;
}
