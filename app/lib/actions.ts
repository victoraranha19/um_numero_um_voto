'use server';

import { revalidatePath } from 'next/cache';
import db from './db';
import { Voto } from './types';

export async function getVotos(): Promise<Voto[]> {
  try {
    const result = await db.query<Voto>('SELECT * FROM votos');
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar votos:', error);
    return [];
  }
}

export async function addVoto(presidente: string): Promise<Voto[]> {
  try {
    const result = await db.query<Voto>(
      'INSERT INTO votos (presidente) VALUES ($1) RETURNING *',
      [presidente],
    );
    revalidatePath('/'); // Revalida a rota raiz para atualizar os dados
    return result.rows;
  } catch (error) {
    console.error('Erro ao adicionar voto:', error);
    return [];
  }
}
