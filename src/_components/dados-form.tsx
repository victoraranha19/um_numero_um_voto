'use client';

import { IErro, IUsuario } from '@lib/types';
import { validarNomeCompleto, validarWhatsapp } from '@lib/validators';
import { DoneRounded, Google } from '@mui/icons-material';
import {
  Chip,
  Divider,
  Fab,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

interface DadosFormProps {
  usuario: IUsuario;
  setUsuario: (u: IUsuario) => void;
  erroWhatsapp: IErro | null;
  erroNome: IErro | null;
  loginComGoogle: () => void;
}

export default function DadosForm({
  usuario,
  setUsuario,
  erroWhatsapp,
  erroNome,
  loginComGoogle,
}: DadosFormProps) {
  const [whatsapp, setWhatsapp] = useState(usuario.whatsapp);
  const whatsappMasked = getMasked(whatsapp);

  function handleNomeChange(nome: string) {
    if (usuario) setUsuario({ ...usuario, nome });
  }

  function handleWhatsappChange(w: string) {
    setWhatsapp(w);
    setUsuario({ ...usuario, whatsapp: w });
  }

  function getMasked(d: string): string {
    const digitos = d.replaceAll(/\D/g, '');
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

  return (
    <Stack direction="column" spacing={2}>
      <Typography>Entre com Google:</Typography>
      <Stack sx={{ alignItems: 'center' }} spacing={1}>
        <Fab
          color="error"
          disabled={!!usuario}
          onClick={() => loginComGoogle()}
        >
          <Google />
        </Fab>
        {usuario ? (
          <Chip
            color="success"
            variant="outlined"
            icon={<DoneRounded />}
            label="Logado"
          />
        ) : (
          <Typography variant="caption">Fazer login</Typography>
        )}
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Typography>Complete com suas informações:</Typography>
      <TextField
        label="Email"
        disabled
        defaultValue={usuario.email}
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start">@</InputAdornment>,
          },
        }}
        error={!usuario.email.length}
      />

      <TextField
        label="Nome Completo"
        disabled={!usuario}
        defaultValue={usuario.nome}
        onChange={(e) => handleNomeChange(e.target.value)}
        error={!!erroNome}
        helperText={erroNome?.erro}
      />
      <TextField
        label="Whatsapp"
        disabled={!usuario}
        placeholder="(00) 0 0000-0000"
        value={whatsappMasked}
        onChange={(e) => handleWhatsappChange(e.target.value)}
        error={!!erroWhatsapp}
        helperText={erroWhatsapp?.erro}
      />
    </Stack>
  );
}
