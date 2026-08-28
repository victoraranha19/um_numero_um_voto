import { EMetodo, EPresidente } from './enums';

export const PRESIDENTE = {
  [EPresidente.BOLSONARO]: 'Bolsonaro',
  [EPresidente.LULA]: 'Lula',
  [EPresidente.NENHUM]: 'Nenhum',
};

export const PAGAMENTO = {
  [EMetodo.PIX]: 'Pix',
  [EMetodo.APPLEPAY]: 'ApplePay',
  [EMetodo.CREDITO]: 'Crédito',
};

export const SITE_URL = 'https://um-numero-um-voto-theta.vercel.app';
export const HANDLE = 'aranhavictor';
export const WEBHOOK_URL = `${SITE_URL}/api/recibo`;
export const REDIRECT_URL = `${SITE_URL}/checkout`;
export const PRECO_ATE_100 = 9; // (em centavos)
export const PRECO_ATE_500 = 8; // (em centavos)
export const PRECO_ATE_1000 = 7; // (em centavos)
export const PRECO_ACIMA_1000 = 5; // (em centavos)

export const EMAIL_SITE = 'umnumeroumvoto@gmail.com';
