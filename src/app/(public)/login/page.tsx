'use client';

import { auth, loginComGoogle } from '@api/auth';
import { salvarDadosUsuario } from '@app/api/usuario/actions';
import DadosForm from '@components/dados-form';
import { SITE_URL } from '@lib/constants';
import { IErro, IUsuario } from '@lib/types';
import { getJWTFromEmail } from '@lib/utils';
import { validarNomeCompleto, validarWhatsapp } from '@lib/validators';
import { onAuthStateChanged } from 'firebase/auth';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirect = decodeURI(searchParams.get('redirect') ?? SITE_URL);

  const [usuario, setUsuario] = useState<IUsuario | null>(null);
  const erroWhatsapp: IErro | null = validarWhatsapp(usuario?.whatsapp ?? '');
  const erroNome: IErro | null = validarNomeCompleto(usuario?.nome ?? '');

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        cookieStore.set('tokenX', getJWTFromEmail(user.email!));
        fetch(`/api/usuario?email=${user.email!}`, { method: 'GET' })
          .then((u) => u.json())
          .then((u: IUsuario[]) => {
            const usuarioDB = u.at(0);
            if (!usuarioDB) return;
            if (usuarioDB.nome && usuarioDB.whatsapp) {
              window.location.href = redirect;
            }
            setUsuario(usuarioDB);
          });
      }
    });
  }, [redirect]);

  function handleSetNome(nome: string) {
    if (usuario) setUsuario({ ...usuario, nome });
  }

  function handleSetWhatsapp(whatsapp: string) {
    if (usuario) setUsuario({ ...usuario, whatsapp });
  }

  async function handleLogin() {
    try {
      await loginComGoogle();
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  }

  async function handleConcluirCadastro() {
    if (!usuario) throw new Error('Usuário não logado!');
    await salvarDadosUsuario(usuario);
    window.location.href = redirect;
  }

  return (
    <DadosForm
      usuario={usuario}
      setNome={handleSetNome}
      setWhatsapp={handleSetWhatsapp}
      loginComGoogle={() => handleLogin()}
      erroNome={erroNome}
      erroWhatsapp={erroWhatsapp}
      concluirCadastro={handleConcluirCadastro}
    />
  );
}
