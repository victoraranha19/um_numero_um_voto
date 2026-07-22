import { JwtPayload } from 'jwt-decode';
import { EMetodo, EPresidente } from './enums';

export interface IUsuario {
  email: string;
  nome: string;
  whatsapp: string;
}

export interface IPedido {
  id: string;
  presidente: EPresidente;
  quantidade: number;
  url_pagamento: string;
  valor_total: number;
  email_usuario: string;
}
export interface IRecibo {
  id: string;
  data_pagamento: Date;
  url_recibo: string;
  codigo_fatura: string;
  metodo_pagamento: EMetodo;
  valor_total: number;
  valor_pago: number;
  parcelas: number;
}

export interface ICota {
  numero: number;
  id_pedido: string;
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

export interface IItem {
  quantity: number;
  price: number;
  description: string;
  product_reference?: string | null;
}
export interface IPayloadCustomer {
  name: string;
  email: string;
  phone_number: string;
}
export interface IPayload {
  handle: string;
  items: IItem[];
  customer?: Partial<IPayloadCustomer>;
  webhook_url?: string;
  redirect_url?: string;
  order_nsu: string;
}

export interface IWebhookParams {
  invoice_slug: string;
  amount: number;
  paid_amount: number;
  installments: number;
  capture_method: string;
  transaction_nsu: string;
  order_nsu: string;
  receipt_url: string;
  items: IItem[];
}

export interface IErro {
  erro: string;
}
