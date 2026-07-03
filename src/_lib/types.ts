export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  whatsapp: string;
}

export interface Cota {
  id: number;
  presidente: string;
  id_usuario: number;
}
