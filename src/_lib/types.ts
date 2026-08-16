import { EMetodo, EPresidente } from './enums';

export interface IUsuario {
  email: string;
  nome: string;
  whatsapp: string;
  notificacoes: boolean;
}

export interface IVotoConfirmado {
  nome: string;
  quantidade: number;
  presidente: EPresidente;
  data_pagamento: string;
}

export interface IPedido {
  id: string;
  presidente: EPresidente;
  quantidade: number;
  url: string;
  valor: number;
  email_usuario: string;
}
export interface IRecibo {
  id: string;
  data_pagamento: string;
  url: string;
  codigo_fatura: string;
  metodo_pagamento: EMetodo;
  valor_total: number;
  valor_pago: number;
  parcelas: number;
}

export interface IPedidoDetalhado extends IPedido {
  recibo?: IRecibo;
}
export interface IReciboDetalhado extends IRecibo {
  pedido: IPedido;
}

export interface IPedidoRecibo {
  pedido_id: string;
  presidente: EPresidente;
  quantidade: number;
  pedido_url: string;
  valor: number;
  email_usuario: string;

  recibo_id: string | null;
  data_pagamento: string | null;
  recibo_url: string | null;
  codigo_fatura: string | null;
  metodo_pagamento: EMetodo | null;
  valor_total: number | null;
  valor_pago: number | null;
  parcelas: number | null;
}

export interface IReciboPedido {
  recibo_id: string;
  data_pagamento: string;
  recibo_url: string;
  codigo_fatura: string;
  metodo_pagamento: EMetodo;
  valor_total: number;
  valor_pago: number;
  parcelas: number;

  pedido_id: string;
  presidente: EPresidente;
  quantidade: number;
  pedido_url: string;
  valor: number;
  email_usuario: string;
}

export interface ICota {
  numero: number;
  id_pedido: string;
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
