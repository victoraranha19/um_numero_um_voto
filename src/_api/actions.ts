'use server';

import { ICota, IUsuario } from '@lib/types';
import { revalidatePath } from 'next/cache';

import db from './db';

export async function getCotas(): Promise<ICota[]> {
  try {
    const result = await db.query<ICota>('SELECT * FROM cotas');
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar cotas:', error);
    return [];
  }
}

export async function addCota(
  presidente: string,
  id_usuario?: number,
): Promise<ICota[]> {
  try {
    // Verifica se o usuário existe antes de adicionar a cota
    const verificaUsuario = await db.query<IUsuario>(
      'SELECT * FROM usuarios WHERE id = $1',
      [id_usuario],
    );
    if (verificaUsuario.rows.length === 0) {
      throw new Error(`Usuário não encontrado.`);
    }
    // Adiciona a cota ao banco de dados
    const result = await db.query<ICota>(
      'INSERT INTO cotas (presidente, id_usuario) VALUES ($1, $2) RETURNING *',
      [presidente, id_usuario],
    );
    // Revalida a rota raiz para atualizar os dados
    revalidatePath('/');
    return result.rows;
  } catch (error) {
    console.error('Erro ao adicionar cota:', error);
    return [];
  }
}
