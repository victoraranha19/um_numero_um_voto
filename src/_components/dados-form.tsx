'use client';

import { salvarDadosUsuario } from '@/app/api/usuario/actions';
import { IUsuario } from '@lib/types';
import { Button, InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';

interface DadosFormProps {
  email: string;
  irParaProximoPasso: () => void;
}

export default function DadosForm({
  email,
  irParaProximoPasso,
}: DadosFormProps) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  function handleTelefoneChange(t: string) {
    const digitos = t.replaceAll(/\D/g, '');
    const numero = parseInt(digitos);

    if (!digitos.length || !numero) {
      setTelefone('');
      return;
    }

    const numeroTelefone = numero.toString();
    const ddd = `(${numeroTelefone.substring(0, 2)}`;
    if (numeroTelefone.length <= 2) {
      setTelefone(ddd);
      return;
    }

    const metade = `${ddd}) ${numeroTelefone.substring(2, 6)}`;
    if (numeroTelefone.length <= 6) {
      setTelefone(metade);
      return;
    }

    setTelefone(`${metade}-${numeroTelefone.substring(6, 10)}`);
  }

  function handleWhatsappChange(w: string) {
    const digitos = w.replaceAll(/\D/g, '');
    const numero = parseInt(digitos);

    if (!digitos.length || !numero) {
      setWhatsapp('');
      return;
    }

    const numeroWhatsapp = numero.toString();
    const ddd = `(${numeroWhatsapp.substring(0, 2)}`;
    if (numeroWhatsapp.length <= 2) {
      setWhatsapp(ddd);
      return;
    }

    const metade = `${ddd}) ${numeroWhatsapp.substring(2, 7)}`;
    if (numeroWhatsapp.length <= 7) {
      setWhatsapp(metade);
      return;
    }

    setWhatsapp(`${metade}-${numeroWhatsapp.substring(7, 11)}`);
  }

  async function handleAvancar() {
    const usuario: IUsuario = { nome, email, telefone, whatsapp };
    try {
      await salvarDadosUsuario(usuario);
      irParaProximoPasso();
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  }

  return (
    <>
      <TextField
        label="Email"
        disabled
        defaultValue={email}
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start">@</InputAdornment>,
          },
        }}
      />

      <TextField
        label="Nome Completo"
        onChange={(e) => setNome(e.target.value)}
      />
      <TextField
        label="Telefone"
        placeholder="(00) 0000-0000"
        onChange={(e) => handleTelefoneChange(e.target.value)}
        value={telefone}
      />
      <TextField
        label="Whatsapp"
        placeholder="(00) 0 0000-0000"
        onChange={(e) => handleWhatsappChange(e.target.value)}
        value={whatsapp}
      />

      <Button variant="contained" onClick={() => handleAvancar()}>
        Avançar
      </Button>
    </>
  );
}
