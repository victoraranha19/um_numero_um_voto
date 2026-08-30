import { JWTPayload, jwtVerify, KeyInput, SignJWT } from 'jose';

import {
  HANDLE,
  PRECO_ACIMA_1000,
  PRECO_ATE_100,
  PRECO_ATE_1000,
  PRECO_ATE_500,
  PRESIDENTE,
  REDIRECT_URL,
  WEBHOOK_URL,
} from './constants';
import { EPresidente } from './enums';
import { IPayload, IPayloadCustomer, IUsuario } from './types';

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

export function goToLoginWithRedirect(
  path: string = '/',
  searchParams?: string,
): string {
  const url = new URL(`${location.origin}/login`);

  url.searchParams.set(
    'redirect',
    `${location.origin}${path}?${searchParams && searchParams?.length ? encodeURIComponent(searchParams) : ''}`,
  );
  return url.href;
}

export function getNomeEscondido(nomeCompleto: string) {
  const nomeDividido = nomeCompleto.split(' ');
  if (nomeDividido.length === 1) {
    return nomeCompleto;
  }
  return `${nomeDividido.at(0)} ${nomeDividido.at(-1)?.charAt(0)}.`;
}

export function getDataBrasil(data: Date) {
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getPayloadCostumer(
  u: IUsuario,
): Partial<IPayloadCustomer> | undefined {
  const phone_number = '+55'.concat(u.whatsapp);
  if (!u && !phone_number) return undefined;
  return {
    email: u.email,
    name: u.nome,
    phone_number,
  };
}

export function getPayload(
  p: EPresidente,
  q: number,
  u: IUsuario,
  order_nsu: string,
): IPayload {
  const payload: IPayload = {
    handle: HANDLE,
    webhook_url: WEBHOOK_URL,
    redirect_url: REDIRECT_URL,
    items: [
      {
        description: `Voto(s) para ${PRESIDENTE[p]}`,
        price: getValorCotas(q),
        quantity: q,
      },
    ],
    customer: getPayloadCostumer(u),
    order_nsu,
  };
  return payload;
}

export function getValorCotas(quantidade: number) {
  if (quantidade <= 100) return PRECO_ATE_100 * quantidade;
  if (quantidade <= 500) return PRECO_ATE_500 * quantidade;
  if (quantidade <= 1000) return PRECO_ATE_1000 * quantidade;
  return PRECO_ACIMA_1000 * quantidade;
}
