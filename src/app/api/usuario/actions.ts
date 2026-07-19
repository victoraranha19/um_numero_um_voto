'use server';

import db from '@api/db';
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

export async function adicionarNovoUsuario({
  nome,
  email,
  telefone,
  whatsapp,
}: IUsuario): Promise<void> {
  try {
    await db`INSERT INTO usuarios (nome, email, telefone, whatsapp) VALUES (${nome}, ${email}, ${telefone}, ${whatsapp})`;
  } catch (error) {
    console.error('Erro ao adicionar novo usuário:', error);
    throw new Error('Erro ao adicionar novo usuário.');
  }
}

export async function salvarDadosUsuario({
  nome,
  telefone,
  whatsapp,
  email,
}: IUsuario) {
  try {
    await db`UPDATE usuarios SET nome=${nome}, telefone=${telefone}, whatsapp=${whatsapp} WHERE email=${email}`;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao adicionar novo usuário.');
  }
}
