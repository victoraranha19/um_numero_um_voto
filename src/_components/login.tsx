'use client';

import { IUsuario } from '@lib/types';
import { auth } from '@api/auth';
import { Button, IconButton } from '@mui/material';
import {
  signInWithPopup,
  GoogleAuthProvider,
  User,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  adicionarNovoUsuario,
  verificarEmailCadastrado,
} from '../app/api/usuario/actions';
import { AccountCircle, Google, Logout, NoAccounts } from '@mui/icons-material';
import { useEffect, useState } from 'react';

export default function Login() {
  const [usuario, setUsuario] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
  }, []);

  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  async function login() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await registrarUsuario(userCredential.user);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  }

  async function toggleLogin() {
    if (usuario) {
      await logout();
    } else {
      await login();
    }
  }

  async function registrarUsuario(user: User) {
    if (!user.email) {
      throw new Error('Não foi possível identificar email do usuário!');
    }
    const usuario: IUsuario = {
      nome: user.displayName ?? '',
      email: user.email,
      whatsapp: '',
    };

    const temEmailCadastrado = await verificarEmailCadastrado(usuario.email);
    if (!temEmailCadastrado) await adicionarNovoUsuario(usuario);
  }

  return (
    <>
      <Button
        sx={{ display: { xs: 'none', sm: 'flex' } }}
        onClick={() => toggleLogin()}
        size="large"
        endIcon={usuario ? <Logout /> : <Google />}
      >
        {usuario ? 'Sair ' : 'Entrar '}
      </Button>
      <IconButton
        sx={{ display: { xs: 'flex', sm: 'none' } }}
        onClick={() => toggleLogin()}
      >
        {usuario ? (
          <NoAccounts fontSize="large" />
        ) : (
          <AccountCircle fontSize="large" />
        )}
      </IconButton>
    </>
  );
}
