'use server';

import db from '@api/db';

export async function getQuantidadeCotasDisponiveis(): Promise<number> {
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
