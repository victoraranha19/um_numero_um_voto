'use client';

import { logout } from '@api/auth';
import { salvarDadosUsuario } from '@app/api/usuario/actions';
import DadosForm from '@components/dados-form';
import { IUsuario } from '@lib/types';
import { useEffect, useState } from 'react';

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<IUsuario | null>(null);

  useEffect(() => {
    const tokenX = sessionStorage.getItem('tokenX');
    const headers = new Headers();
    if (tokenX) headers.set('Authorization', `Basic ${tokenX}`);

    fetch(`/api/usuario`, { method: 'GET', headers })
      .then((u) => {
        if (u.status === 401) location.href = location.origin;
        if (u.status === 403) {
          logout();
          location.href = location.origin;
        }
        return u.json();
      })
      .then((u: IUsuario[]) => {
        const usuarioDB = u.at(0);
        if (!usuarioDB) {
          throw new Error('Usuário não encontrado no banco de dados');
        }
        setUsuario(usuarioDB);
      })
      .catch((error) => {
        console.error('Erro ao buscar usuário:', error);
        logout();
        window.location.href = '/login';
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
