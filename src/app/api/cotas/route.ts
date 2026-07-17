import db from '@api/db';
import { EPapel, getEmailFromJWT } from '../usuario/usuario.utils';
import { ICota } from '@lib/types';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Verifica autenticação do usuário
    const cookie = request.headers.get('Cookie');
    if (!cookie) throw new Error('Não autenticado! Cookie não encontrado.');
    const emailProprio = getEmailFromJWT(cookie);

    // Verifica se exite parâmetro id na url
    const { searchParams } = new URL(request.url);
    const order_nsu = searchParams.get('id');

    if (!order_nsu) {
      // Retorna todas as cotas do usuário
      const result = await db.query<ICota>(
        `SELECT c.numero, c.id_transacao
        FROM usuarios u JOIN transacoes t ON u.email = t.email_usuario
        JOIN cotas c ON t.order_nsu = c.id_transacao
        WHERE email = $1`,
        [emailProprio],
      );
      return NextResponse.json(result.rows);
    }

    // Verifica se o usuário é dono do pedido ou admin
    const dono_pedido = (
      await db.query<{ dono_pedido: boolean }>(
        'SELECT EXISTS (SELECT 1 FROM usuarios JOIN transacoes ON email = email_usuario WHERE email = $1 AND order_nsu = $2) as dono_pedido',
        [emailProprio, order_nsu],
      )
    ).rows[0].dono_pedido;
    const administrador = (
      await db.query<{ admin: boolean }>(
        'SELECT EXISTS (SELECT 1 FROM usuarios WHERE email = $1 AND papel = $2) as admin',
        [emailProprio, EPapel.ADMIN],
      )
    ).rows[0].admin;
    if (!administrador && !dono_pedido) throw new Error('Não autorizado!');

    // Retorna cotas do pedido pesquisado
    const result = await db.query<ICota>(
      'SELECT numero, id_transacao FROM cotas WHERE order_nsu = $1',
      [order_nsu],
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    return NextResponse.json([], { status: 400 });
  }
}
