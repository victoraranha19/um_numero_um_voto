import { jwtDecode } from 'jwt-decode';
import sign from 'jwt-encode';
import { IJWTToken } from './types';

export function getEmailFromJWT(cookie: string) {
  const emailFromToken = jwtDecode<IJWTToken>(cookie).email;
  if (!emailFromToken) throw new Error('Email não encontrado no cookie');
  return emailFromToken;
}

export function getJWTFromEmail(email: string) {
  const token = { email, expires: new Date(Date.now() + 10 * 1000) };
  return sign(token, '');
}
