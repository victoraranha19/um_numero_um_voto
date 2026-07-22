import { EPresidente } from './enums';

export const PRESIDENTE = {
  [EPresidente.BOLSONARO]: 'Bolsonaro',
  [EPresidente.LULA]: 'Lula',
  [EPresidente.NENHUM]: 'Nulo',
};

export const SITE_URL = 'https://um-numero-um-voto-theta.vercel.app';
export const HANDLE = 'aranhavictor';
export const WEBHOOK_URL = `${SITE_URL}/api/recibo`;
export const REDIRECT_URL = `${SITE_URL}/checkout`;
export const PRICE = 10; // (em centavos)
