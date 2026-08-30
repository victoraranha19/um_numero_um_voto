'use client';

import { logout } from '@api/auth';
import { salvarDadosUsuario } from '@app/api/usuario/actions';
import DadosForm from '@components/dados-form';
import { IUsuario } from '@lib/types';
import { goToLoginWithRedirect } from '@lib/utils';
import { useEffect, useState } from 'react';

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<IUsuario | null>(null);

  async function getUsuarioDB(headers: Headers): Promise<IUsuario> {
    const response = await fetch(`/api/usuario`, { method: 'GET', headers });
    let usuario: IUsuario | null;
    switch (response.status) {
      case 403:
      case 401:
        usuario = null;
        break;
      default:
        usuario = ((await response.json()) as IUsuario[])[0];
    }
    if (usuario === null) {
      throw new Error('Usuário não encontrado no banco de dados');
    }
    return usuario;
  }

  useEffect(() => {
    const tokenX = sessionStorage.getItem('tokenX');
    const headers = new Headers();
    if (tokenX) headers.set('Authorization', `Basic ${tokenX}`);

    getUsuarioDB(headers)
      .then((u) => setUsuario(u))
      .catch((error) => {
        logout();
        location.href = goToLoginWithRedirect('/perfil');
        console.error('Erro ao buscar usuário:', error);
      });
  }, []);

  async function salvarUsuario() {
    if (!usuario) throw new Error('Usuário não logado!');
    await salvarDadosUsuario(usuario);
  }

  return (
    usuario && (
      <DadosForm
        usuario={usuario}
        setUsuario={setUsuario}
        salvarUsuario={salvarUsuario}
      />
    )
  );
}
