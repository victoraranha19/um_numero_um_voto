'use server';

import db from '@api/db';
import { IUsuario, IUsuario } from '@lib/types';

export async function verificarEmailCadastrado(
  email: string,
): Promise<boolean> {
  try {
    const result = await db.query<{ email_existe: boolean }>(
      'SELECT EXISTS (SELECT 1 FROM usuarios WHERE email = $1) AS email_existe',
      [email],
    );
    return result.rows[0].email_existe;
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
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao adicionar novo usuário.');
  }
}

export async function salvarPresidente(usuario: IUsuario) {
  try {
    const { presidente, email } = usuario;
    await db.query<IUsuario>(
      `UPDATE usuarios SET presidente=$1 WHERE email=$2`,
      [presidente, email],
    );
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao adicionar novo usuário.');
  }
}
