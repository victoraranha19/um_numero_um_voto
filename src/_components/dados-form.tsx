'use client';

import { salvarDadosUsuario } from '@app/api/usuario/actions';
import { IUsuario } from '@lib/types';
import { Button, InputAdornment, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

interface DadosFormProps {
  usuario: IUsuario;
  setUsuario: (u: IUsuario) => void;
  irParaProximoPasso: () => void;
}

export default function DadosForm({
  usuario,
  setUsuario,
  irParaProximoPasso,
}: DadosFormProps) {
  const [whatsapp, setWhatsapp] = useState(usuario.whatsapp);
  const whatsappMasked = getMasked(whatsapp);

  function handleNomeChange(nome: string) {
    if (usuario) setUsuario({ ...usuario, nome });
  }

  function handleWhatsappChange(w: string) {
    setWhatsapp(w);
    setUsuario({ ...usuario, whatsapp: whatsappMasked });
  }

  function getMasked(phone: string): string {
    const digitos = phone.replaceAll(/\D/g, '');
    const numero = parseInt(digitos);

    if (!digitos.length || !numero) return '';

    const totalDigits = digitos.length < 11 ? 10 : 11;
    const numeroWhatsapp = numero.toString();
    const ddd = `(${numeroWhatsapp.substring(0, 2)}`;
    if (numeroWhatsapp.length <= 2) return ddd;

    const iMetade = totalDigits - 4;
    const metade = `${ddd}) ${numeroWhatsapp.substring(2, iMetade)}`;
    if (numeroWhatsapp.length <= iMetade) return metade;

    return `${metade}-${numeroWhatsapp.substring(iMetade, totalDigits)}`;
  }

  async function handleAvancar() {
    try {
      if (!usuario) throw new Error('Usuário não logado!');
      await salvarDadosUsuario(usuario);
      irParaProximoPasso();
    } catch (error) {
      console.error('Erro ao atualizar dados usuario:', error);
    }
  }

  return (
    <>
      {usuario && (
        <TextField
          label="Email"
          disabled
          defaultValue={usuario.email}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">@</InputAdornment>
              ),
            },
          }}
        />
      )}

      <TextField
        label="Nome Completo"
        defaultValue={usuario.nome}
        onChange={(e) => handleNomeChange(e.target.value)}
      />
      <TextField
        label="Whatsapp"
        placeholder="(00) 0 0000-0000"
        value={whatsappMasked}
        onChange={(e) => handleWhatsappChange(e.target.value)}
      />

      <Button variant="contained" onClick={() => handleAvancar()}>
        Avançar
      </Button>
    </>
  );
}
