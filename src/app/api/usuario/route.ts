import { IUsuario } from '@/_lib/types';
import db from '@api/db';

import { EPapel, getEmailFromJWT } from './usuario.utils';
import { NextResponse } from 'next/server';

export async function GET(request: Request): Promise<Response> {
  try {
    // Verifica autenticação do usuário
    const cookie = request.headers.get('Cookie');
    if (!cookie) throw new Error('Não autenticado! Cookie não encontrado.');
    const emailProprio = getEmailFromJWT(cookie);

    // Verifica se exite parâmetro email na url
    const { searchParams } = new URL(request.url);
    const emailPesquisado = searchParams.get('email');

    if (!emailPesquisado) {
      // Retorna proprio email
      const result = await db.query<IUsuario>(
        'SELECT nome, email, telefone, whatsapp, presidente FROM usuarios WHERE email = $1',
        [emailProprio],
      );
      return NextResponse.json(result.rows);
    }

    if (emailPesquisado !== emailProprio) {
      // Verifica se o usuário é admin
      const administrador = (
        await db.query<{ admin: boolean }>(
          'SELECT EXISTS (SELECT 1 FROM usuarios WHERE email = $1 AND papel = $2) AS admin',
          [emailProprio, EPapel.ADMIN],
        )
      ).rows[0].admin;
      if (!administrador) throw new Error('Não autorizado!');
    }

    // Retorna email pesquisado
    const result = await db.query<IUsuario>(
      'SELECT nome, email, telefone, whatsapp, presidente FROM usuarios WHERE email = $1',
      [emailPesquisado],
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return NextResponse.json([], { status: 400 });
  }
}
