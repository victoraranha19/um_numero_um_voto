import db from '@api/db';
import { IUsuario } from '@lib/types';
import { getEmailFromRequest } from '@lib/utils';
import { NextResponse } from 'next/server';

import { verificarAcessoAdmin } from './actions';

export async function GET(request: Request): Promise<Response> {
  try {
    // Verifica autenticação do usuário
    const emailProprio = getEmailFromRequest(request.headers);

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
      const administrador = await verificarAcessoAdmin(emailProprio);
      if (!administrador) return NextResponse.json([], { status: 401 });
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
