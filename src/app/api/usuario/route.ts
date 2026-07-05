import { Usuario } from '@/_lib/types';
import db from '@api/db';

import { getEmailFromCookieHeader } from './usuario.utils';

export async function GET(request: Request): Promise<Response> {
  try {
    // Verifica autenticação do usuário
    const cookie = request.headers.get('Cookie');
    if (!cookie) throw new Error('Não autenticado! Cookie não encontrado.');
    const emailProprio = getEmailFromCookieHeader(cookie);

    // Verifica se exite parâmetro email na url
    const { searchParams } = new URL(request.url);
    const emailPesquisado = searchParams.get('email');

    if (!emailPesquisado) {
      // Retorna proprio email
      const result = await db.query<Usuario>(
        'SELECT nome, email, telefone, whatsapp FROM usuarios WHERE email = $1',
        [emailProprio],
      );
      return Response.json(result.rows);
    }

    if (emailPesquisado !== emailProprio) {
      // Verifica se o usuário é admin
      const administrador = (
        await db.query<{ admin: boolean }>(
          'SELECT acesso FROM usuarios WHERE email = $1',
          [emailProprio],
        )
      ).rows[0].admin;
      if (!administrador) throw new Error('Não autorizado!');
    }

    // Retorna email pesquisado
    const result = await db.query<Usuario>(
      'SELECT nome, email, telefone, whatsapp FROM usuarios WHERE email = $1',
      [emailPesquisado],
    );
    return Response.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return Response.json([]);
  }
}
