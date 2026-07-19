import db from '@api/db';
import { ICota } from '@lib/types';
import { NextResponse } from 'next/server';

import { EPapel, getEmailFromJWT } from '../usuario/usuario.utils';

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
      const result = (await db`SELECT c.numero, c.id_transacao
        FROM usuarios u JOIN transacoes t ON u.email = t.email_usuario
        JOIN cotas c ON t.order_nsu = c.id_transacao
        WHERE email = ${emailProprio}`) as ICota[];
      return NextResponse.json(result);
    }

    // Verifica se o usuário é dono do pedido ou admin
    const dono_pedido = (
      (await db`SELECT EXISTS
        (SELECT 1 FROM usuarios JOIN transacoes ON email = email_usuario WHERE email = ${emailProprio} AND order_nsu = ${order_nsu})
        as dono_pedido`) as { dono_pedido: boolean }[]
    )[0].dono_pedido;
    const administrador = (
      (await db`SELECT EXISTS
      (SELECT 1 FROM usuarios WHERE email = ${emailProprio} AND papel = ${EPapel.ADMIN})
      as admin`) as { admin: boolean }[]
    )[0].admin;
    if (!administrador && !dono_pedido) throw new Error('Não autorizado!');

    // Retorna cotas do pedido pesquisado
    const result = (await db`SELECT numero, id_transacao
      FROM cotas WHERE order_nsu = ${order_nsu}`) as ICota[];
    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    return NextResponse.json([], { status: 400 });
  }
}
