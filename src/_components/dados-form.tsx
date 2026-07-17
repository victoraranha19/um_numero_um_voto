'use client';

import { salvarDadosUsuario } from '@/app/api/usuario/actions';
import { IUsuario } from '@lib/types';
import { Button, InputAdornment, TextField } from '@mui/material';

interface DadosFormProps {
  usuario: IUsuario | null;
  setUsuario: (u: IUsuario) => void;
  irParaProximoPasso: () => void;
}

export default function DadosForm({
  usuario,
  setUsuario,
  irParaProximoPasso,
}: DadosFormProps) {
  function handleNomeChange(nome: string) {
    if (usuario) setUsuario({ ...usuario, nome });
  }

  function handleTelefoneChange(t: string) {
    if (usuario) {
      const telefone = getMaskedPhone(t);
      setUsuario({ ...usuario, telefone });
    }
  }

  function handleWhatsappChange(w: string) {
    if (usuario) {
      const whatsapp = getMaskedPhone(w);
      setUsuario({ ...usuario, whatsapp });
    }
  }

  function getMaskedPhone(phone: string, totalDigits = 11): string {
    const digitos = phone.replaceAll(/\D/g, '');
    const numero = parseInt(digitos);

    if (!digitos.length || !numero) return '';

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
          defaultValue={usuario?.email ?? ''}
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
        defaultValue={usuario?.nome ?? ''}
        onChange={(e) => handleNomeChange(e.target.value)}
      />
      <TextField
        label="Telefone"
        placeholder="(00) 0000-0000"
        defaultValue={usuario?.telefone ?? ''}
        onChange={(e) => handleTelefoneChange(e.target.value)}
      />
      <TextField
        label="Whatsapp"
        placeholder="(00) 0 0000-0000"
        defaultValue={usuario?.whatsapp ?? ''}
        onChange={(e) => handleWhatsappChange(e.target.value)}
      />

      <Button variant="contained" onClick={() => handleAvancar()}>
        Avançar
      </Button>
    </>
  );
}
