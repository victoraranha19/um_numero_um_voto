'use server';

import { IUsuario } from '@lib/types';
import db from '@api/db';
import { revalidatePath } from 'next/cache';

export async function verificarEmailCadastrado(
  email: string,
): Promise<boolean> {
  try {
    const result = await db.query<{ email: string }>(
      'SELECT email FROM usuarios WHERE email = $1',
      [email],
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error('Erro ao verificar usuários cadastrados:', error);
    throw new Error('Erro ao verificar usuários cadastrados.');
  }
}

export async function adicionarNovoUsuario(usuario: IUsuario): Promise<void> {
  try {
    const { nome, email, telefone, whatsapp } = usuario;
    await db.query<IUsuario>(
      'INSERT INTO usuarios (nome, email, telefone, whatsapp) VALUES ($1, $2, $3, $4)',
      [nome, email, telefone, whatsapp],
    );
    // Revalida a rota raiz para atualizar os dados
    revalidatePath('/');
  } catch (error) {
    console.error('Erro ao adicionar novo usuário:', error);
    throw new Error('Erro ao adicionar novo usuário.');
  }
}

export async function salvarDadosUsuario(usuario: IUsuario) {
  try {
    const { nome, telefone, whatsapp, email } = usuario;
    await db.query<IUsuario>(
      `UPDATE usuarios SET nome=$1, telefone=$2, whatsapp=$3 WHERE email=$4`,
      [nome, telefone, whatsapp, email],
    );
    // Revalida a rota raiz para atualizar os dados
    revalidatePath('/');
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao adicionar novo usuário.');
  }
}
