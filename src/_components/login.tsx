'use client';

import { IUsuario } from '@lib/types';
import { auth } from '@api/auth';
import { Button, Typography } from '@mui/material';
import { signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import {
  adicionarNovoUsuario,
  verificarEmailCadastrado,
} from '../app/api/usuario/actions';

export default function Login() {
  async function handleLogin() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await registrarUsuario(userCredential.user);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  }

  async function registrarUsuario(user: User) {
    if (!user.email) {
      throw new Error('Não foi possível identificar email do usuário!');
    }
    const usuario: IUsuario = {
      nome: user.displayName ?? '',
      email: user.email,
      telefone: '',
      whatsapp: '',
    };

    const temEmailCadastrado = await verificarEmailCadastrado(usuario.email);
    if (!temEmailCadastrado) await adicionarNovoUsuario(usuario);
  }

  return (
    <>
      <Typography variant="h4" component="h1">
        Entre com sua conta
      </Typography>
      <Button variant="contained" onClick={() => handleLogin()}>
        Login com Google
      </Button>
    </>
  );
}
