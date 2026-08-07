import { jwtVerify, KeyInput, SignJWT, JWTPayload } from 'jose';
import {
  IPedido,
  IPedidoDetalhado,
  IPedidoRecibo,
  IRecibo,
  IReciboDetalhado,
  IReciboPedido,
} from './types';
import { SITE_URL } from './constants';

interface IToken extends JWTPayload {
  email: string;
}

async function getEmailFromJWT(token: string) {
  const secret: KeyInput = new TextEncoder().encode(
    process.env.NEXT_PUBLIC_JWT_SECRET ?? '',
  );
  const emailFromToken = ((await jwtVerify(token, secret)).payload as IToken)
    .email;
  return emailFromToken;
}

export async function getJWTFromEmail(email: string) {
  const token: IToken = { email };
  const secret: KeyInput = new TextEncoder().encode(
    process.env.NEXT_PUBLIC_JWT_SECRET ?? '',
  );
  return await new SignJWT(token)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secret);
}

export async function getEmailFromRequest(headers: Headers) {
  try {
    const token = headers.get('Authorization')?.split(' ').at(1);
    if (!token || !token.length) {
      throw new Error('Não autenticado!');
    }
    return await getEmailFromJWT(token);
  } catch (error) {
    console.error('Token invalido', error);
    return null;
  }
}

function toRecibo({
  data_pagamento,
  recibo_id,
  codigo_fatura,
  metodo_pagamento,
  recibo_url,
  valor_total,
  valor_pago,
  parcelas,
}: IPedidoRecibo): IRecibo {
  return {
    data_pagamento: data_pagamento!,
    id: recibo_id!,
    codigo_fatura: codigo_fatura!,
    metodo_pagamento: metodo_pagamento!,
    url: recibo_url!,
    valor_total: valor_total!,
    valor_pago: valor_pago!,
    parcelas: parcelas!,
  };
}

function toPedido(reciboPedido: IPedidoRecibo): IPedido {
  return {
    email_usuario: reciboPedido.email_usuario,
    id: reciboPedido.pedido_id,
    presidente: reciboPedido.presidente,
    quantidade: reciboPedido.quantidade,
    url: reciboPedido.pedido_url,
    valor: reciboPedido.valor,
  };
}

export function toPedidoDetalhado(
  pedidoRecibo: IPedidoRecibo,
): IPedidoDetalhado {
  const recibo: IRecibo | undefined = pedidoRecibo.recibo_id
    ? toRecibo(pedidoRecibo)
    : undefined;
  return {
    ...toPedido(pedidoRecibo),
    recibo,
  };
}

export function toReciboDetalhado(
  reciboPedido: IReciboPedido,
): IReciboDetalhado {
  const pedido: IPedido = toPedido(reciboPedido);
  return {
    ...toRecibo(reciboPedido),
    pedido,
  };
}

export function goToLoginWithRedirect(
  path: string = '/',
  searchParams?: string,
  url_origin = SITE_URL,
): string {
  const url = new URL(`${url_origin}/login`);

  url.searchParams.set(
    'redirect',
    `${url_origin}${path}?${searchParams && searchParams?.length ? encodeURIComponent(searchParams) : ''}`,
  );
  return url.href;
}
