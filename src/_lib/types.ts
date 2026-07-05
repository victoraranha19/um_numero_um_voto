import { JwtPayload } from 'jwt-decode';

export interface Usuario {
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

export interface JWTToken extends JwtPayload {
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
