import { EPresidente } from './types';

export const PRESIDENTE = {
  [EPresidente.BOLSONARO]: 'Bolsonaro',
  [EPresidente.LULA]: 'Lula',
  [EPresidente.NENHUM]: 'Nulo',
};

export const SITE_URL = 'https://um-numero-um-voto-theta.vercel.app';
export const HANDLE = 'aranhavictor';
export const WEBHOOK_URL = `${SITE_URL}/api/transacoes`;
export const PRICE = 100; // (R$ 1,00 em centavos)
