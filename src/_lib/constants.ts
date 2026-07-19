import { EPresidente } from './types';

export const PRESIDENTE = {
  [EPresidente.BOLSONARO]: 'Bolsonaro',
  [EPresidente.LULA]: 'Lula',
  [EPresidente.NENHUM]: 'Nulo',
};

export const HANDLE = 'aranhavictor';
export const WEBHOOK_URL =
  'https://um-numero-um-voto-theta.vercel.app/api/transacoes';
export const PRICE = 100; // (R$ 1,00 em centavos)
