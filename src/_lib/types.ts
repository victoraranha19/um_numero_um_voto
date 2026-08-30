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
  data_pago: string;
}

export interface IVotoPresidente {
  presidente: EPresidente;
  total: number;
}

export interface IPedidoCriacao {
  presidente: EPresidente;
  quantidade: number;
  valor: number;
  email_usuario: string;
}
export interface IPedido extends IPedidoCriacao {
  id: string;
  url: string;

  recibo_id: string | null;
  data_pago: string | null;
  cod_fatura: string | null;
  metodo: EMetodo | null;
  valor_total: number | null;
  valor_pago: number | null;
  parcelas: number;
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
