import { IUsuario } from '@lib/types';
import db from '@api/db';

import { EPapel, getEmailFromJWT } from './usuario.utils';
import { NextResponse } from 'next/server';

export async function GET(request: Request): Promise<Response> {
  try {
    // Verifica autenticação do usuário
    const cookie = request.headers.get('Cookie');
    if (!cookie || !cookie.length) {
      throw new Error('Não autenticado! Cookie não encontrado.');
    }
    const emailProprio = getEmailFromJWT(cookie);

    // Verifica se exite parâmetro email na url
    const { searchParams } = new URL(request.url);
    const emailPesquisado = searchParams.get('email');

    if (!emailPesquisado) {
      // Retorna proprio email
      const result =
        (await db`SELECT nome, email, whatsapp FROM usuarios WHERE email = ${emailProprio}`) as IUsuario[];
      return NextResponse.json(result);
    }

    if (emailPesquisado !== emailProprio) {
      // Verifica se o usuário é admin
      const administrador = (
        (await db`SELECT EXISTS
          (SELECT 1 FROM usuarios WHERE email = ${emailProprio} AND papel = ${EPapel.ADMIN})
          AS admin`) as { admin: boolean }[]
      )[0].admin;
      if (!administrador) throw new Error('Não autorizado!');
    }

    // Retorna email pesquisado
    const result = (await db`SELECT nome, email, whatsapp
        FROM usuarios WHERE email = ${emailPesquisado}`) as IUsuario[];
    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return NextResponse.json([], { status: 400 });
  }
}
