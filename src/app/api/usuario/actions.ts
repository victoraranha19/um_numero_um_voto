'use server';

import db from '@api/db';
import { EPapel } from '@lib/enums';
import { IUsuario } from '@lib/types';

export async function verificarEmailCadastrado(
  email: string,
): Promise<boolean> {
  try {
    const result = (await db`SELECT EXISTS
          (SELECT 1 FROM usuarios WHERE email = ${email})
          AS email_existe`) as { email_existe: boolean }[];
    return result[0].email_existe;
  } catch (error) {
    console.error('Erro ao verificar usuários cadastrados:', error);
    throw new Error('Erro ao verificar usuários cadastrados.');
  }
}

export async function verificarAcessoAdmin(email: string) {
  try {
    const result = (await db`SELECT EXISTS
      (SELECT 1 FROM usuarios WHERE email = ${email} AND papel = ${EPapel.ADMIN})
      AS admin`) as { admin: boolean }[];
    return result[0].admin;
  } catch (error) {
    console.error('Erro ao verificar acesso admin:', error);
    throw new Error('Erro ao verificar acesso admin.');
  }
}

export async function adicionarNovoUsuario({
  nome,
  email,
  whatsapp,
}: IUsuario): Promise<void> {
  try {
    await db`INSERT INTO usuarios (nome, email, whatsapp) VALUES (${nome}, ${email}, ${whatsapp})`;
  } catch (error) {
    console.error('Erro ao adicionar novo usuário:', error);
    throw new Error('Erro ao adicionar novo usuário.');
  }
}

export async function salvarDadosUsuario({ nome, whatsapp, email }: IUsuario) {
  try {
    await db`UPDATE usuarios SET nome=${nome}, whatsapp=${whatsapp} WHERE email=${email}`;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao adicionar novo usuário.');
  }
}
