import { JwtPayload } from 'jwt-decode';

export interface IUsuarioNovo {
  email: string;
  nome: string;
  telefone: string;
  whatsapp: string;
}
export interface IUsuario extends IUsuarioNovo {
  presidente: EPresidente;
}

export interface ITransacaoNova {
  order_nsu: string;
  url_pagamento: string;
  quantidade: number;
  valor_total: number;
  email_usuario: string;
}
export interface ITransacao extends ITransacaoNova {
  slug: string;
  valor_pago: number;
  parcelas: number;
  metodo_pagamento: EMetodo;
  transaction_nsu: string;
  url_recibo: string;
  foi_pago: boolean;
  sucesso: boolean;
}

export interface ICota {
  numero: number;
  id_transacao: string;
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

export interface IPayload {
  handle: string;
  items: IItem[];
  customer?: Partial<IPayloadCustomer>;
  webhook_url?: string;
  order_nsu?: string;
}
export interface IItem {
  quantity: number;
  price: number;
  description: string;
}
interface IPayloadCustomer {
  name: string;
  email: string;
  phone_number: string;
}

// Utils

export enum EMetodo {
  PIX = 'P',
  CREDITO = 'C',
}

export enum EPresidente {
  LULA = 'L',
  BOLSONARO = 'B',
  NENHUM = 'N',
}
