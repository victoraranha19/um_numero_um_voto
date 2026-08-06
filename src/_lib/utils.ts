import { jwtDecode } from 'jwt-decode';
import sign from 'jwt-encode';
import {
  IJWTToken,
  IPedido,
  IPedidoDetalhado,
  IPedidoRecibo,
  IRecibo,
  IReciboDetalhado,
  IReciboPedido,
} from './types';
import { SITE_URL } from './constants';

export function getEmailFromJWT(token: string) {
  const emailFromToken = jwtDecode<IJWTToken>(token).email;
  if (!emailFromToken) throw new Error('Email não encontrado no cookie');
  return emailFromToken;
}

export function getJWTFromEmail(email: string) {
  const token = { email, expires: new Date(Date.now() + 10 * 1000) };
  return sign(token, '');
}

export function getEmailFromRequest(headers: Headers) {
  const token = headers.get('Authorization')?.split(' ').at(1);
  if (!token || !token.length) {
    throw new Error('Não autenticado!');
  }
  return getEmailFromJWT(token);
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
