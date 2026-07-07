import { JwtPayload } from 'jwt-decode';

export interface IUsuario {
  email: string;
  nome: string;
  telefone: string;
  whatsapp: string;
}

interface IRecibo {
  transaction_nsu: string;
  order_nsu: string;
  url_recibo: string;
  slug: string;
  email_usuario: number;
}
export interface IPagamento {
  valor_total: number;
  valor_pago: number;
  quantidade: number;
  metodo_pagamento: EMetodo;
  parcelas: number;

  foi_pago: boolean;
  sucesso: boolean;
}

export interface ITransacaoNova extends IRecibo, Partial<IPagamento> {}
export interface ITransacao extends IRecibo, IPagamento {}

export interface ICota {
  numero: number;
  presidente: string;
}

export interface IJWTToken extends JwtPayload {
  name: string;
  picture: string;
  auth_time: number;
  user_id: string;
  email: string;
  email_verified: boolean;
  firebase: {
    identities: Record<string, string[]>;
    sign_in_provider: string;
  };
}

// Utils

export enum EMetodo {
  PIX = 'pix',
  CREDITO = 'credito',
}

export enum EPresidente {
  LULA = 'L',
  BOLSONARO = 'B',
  NENHUM = 'N',
}
