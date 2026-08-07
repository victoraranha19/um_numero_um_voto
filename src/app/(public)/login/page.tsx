'use client';

import { auth, loginComGoogle } from '@api/auth';
import { salvarDadosUsuario } from '@app/api/usuario/actions';
import DadosForm from '@components/dados-form';
import { SITE_URL } from '@lib/constants';
import { IUsuario } from '@lib/types';
import { getJWTFromEmail } from '@lib/utils';
import { onAuthStateChanged } from 'firebase/auth';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirect = decodeURI(searchParams.get('redirect') ?? SITE_URL);

  const [usuario, setUsuario] = useState<IUsuario | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getJWTFromEmail(user.email!).then((tokenX) => {
          sessionStorage.setItem('tokenX', tokenX);
          const headers = new Headers();
          headers.set('Authorization', `Basic ${tokenX}`);

          return fetch(`/api/usuario?email=${user.email!}`, {
            method: 'GET',
            headers,
          })
            .then((u) => u.json())
            .then((u: IUsuario[]) => {
              const usuarioDB = u.at(0);
              if (!usuarioDB) return;
              if (usuarioDB.nome && usuarioDB.whatsapp) {
                window.location.href = redirect;
              }
              setUsuario(usuarioDB);
            });
        });
      }
    });
  }, [redirect]);

  async function handleLogin() {
    try {
      await loginComGoogle();
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  }

  async function salvarUsuario() {
    if (!usuario) throw new Error('Usuário não logado!');
    await salvarDadosUsuario(usuario);
    window.location.href = redirect;
  }

  return (
    <DadosForm
      usuario={usuario}
      setUsuario={setUsuario}
      loginComGoogle={() => handleLogin()}
      salvarUsuario={salvarUsuario}
      ehCriacao={true}
    />
  );
}
