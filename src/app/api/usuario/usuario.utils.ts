import { IJWTToken } from '@/_lib/types';
import { jwtDecode } from 'jwt-decode';

export function getEmailFromCookieHeader(cookie: string) {
  const indexStart = cookie.indexOf('=');
  const indexEnd = cookie.indexOf(';');
  const jwtToken = cookie.slice(
    indexStart + 1,
    indexEnd === -1 ? undefined : indexEnd,
  );

  const emailFromToken = jwtDecode<IJWTToken>(jwtToken).email;
  if (!emailFromToken) throw new Error('Email não encontrado no cookie');
  return emailFromToken;
}
