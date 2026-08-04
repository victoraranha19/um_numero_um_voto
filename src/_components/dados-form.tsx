'use client';

import { IErro, IUsuario } from '@lib/types';
import { DoneRounded, Google } from '@mui/icons-material';
import {
  Button,
  Chip,
  Divider,
  Fab,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

interface DadosFormProps {
  usuario: IUsuario | null;
  setNome: (n: string) => void;
  setWhatsapp: (w: string) => void;
  erroWhatsapp: IErro | null;
  erroNome: IErro | null;
  loginComGoogle: () => void;
  concluirCadastro: () => void;
}

export default function DadosForm({
  usuario,
  setNome,
  setWhatsapp,
  erroWhatsapp,
  erroNome,
  loginComGoogle,
  concluirCadastro,
}: DadosFormProps) {
  const whatsappMasked = getMasked(usuario?.whatsapp ?? '');

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
      <Tooltip placement="top" title={!usuario && 'Primeiro entre com Google'}>
        <TextField
          label="Email"
          disabled={!usuario}
          defaultValue={usuario?.email}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">@</InputAdornment>
              ),
            },
          }}
          error={!!usuario && !usuario.email.length}
        />
      </Tooltip>

      <Tooltip placement="top" title={!usuario && 'Primeiro entre com Google'}>
        <TextField
          label="Nome Completo"
          disabled={!usuario}
          defaultValue={usuario?.nome}
          onChange={(e) => setNome(e.target.value)}
          error={!!usuario && !!erroNome}
          helperText={!!usuario && erroNome?.erro}
        />
      </Tooltip>

      <Tooltip placement="top" title={!usuario && 'Primeiro entre com Google'}>
        <TextField
          label="Whatsapp"
          disabled={!usuario}
          placeholder="(00) 0 0000-0000"
          value={whatsappMasked}
          onChange={(e) => setWhatsapp(e.target.value)}
          error={!!usuario && !!erroWhatsapp}
          helperText={!!usuario && erroWhatsapp?.erro}
        />
      </Tooltip>

      <Button
        fullWidth
        variant="contained"
        onClick={() => concluirCadastro()}
        disabled={!usuario || !!erroWhatsapp?.erro || !!erroNome?.erro}
      >
        Avançar
      </Button>
    </Stack>
  );
}
