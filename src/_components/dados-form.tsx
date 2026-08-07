'use client';

import { IErro, IUsuario } from '@lib/types';
import { validarNomeCompleto, validarWhatsapp } from '@lib/validators';
import { DoneRounded, Google } from '@mui/icons-material';
import {
  Button,
  Checkbox,
  Chip,
  Divider,
  Fab,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

interface DadosFormProps {
  usuario: IUsuario | null;
  setUsuario: (u: IUsuario | null) => void;
  loginComGoogle?: () => void;
  salvarUsuario: () => void;
  ehCriacao?: boolean;
}

export default function DadosForm({
  usuario,
  setUsuario,
  loginComGoogle = () => void 0,
  salvarUsuario,
  ehCriacao = false,
}: DadosFormProps) {
  const erroWhatsapp: IErro | null = validarWhatsapp(usuario?.whatsapp ?? '');
  const erroNome: IErro | null = validarNomeCompleto(usuario?.nome ?? '');
  const whatsappMasked = getMasked(usuario?.whatsapp ?? '');

  const [termosAceitos, setTermosAceitos] = useState(!ehCriacao);

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
      {ehCriacao && (
        <>
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
        </>
      )}

      {usuario && (
        <>
          <Typography>
            {ehCriacao ? 'Complete suas informações:' : 'Minhas Informações:'}
          </Typography>
          <TextField
            label="Email"
            disabled={true}
            defaultValue={usuario.email}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">@</InputAdornment>
                ),
              },
            }}
            error={!usuario.email.length}
          />

          <TextField
            label="Nome Completo"
            defaultValue={usuario.nome}
            onChange={(e) =>
              usuario && setUsuario({ ...usuario, nome: e.target.value })
            }
            error={!!erroNome}
            helperText={erroNome?.erro}
          />

          <TextField
            label="Whatsapp"
            placeholder="(00) 0 0000-0000"
            value={whatsappMasked}
            onChange={(e) =>
              usuario &&
              setUsuario({
                ...usuario,
                whatsapp: getMasked(e.target.value ?? ''),
              })
            }
            error={!!erroWhatsapp}
            helperText={erroWhatsapp?.erro}
          />

          <FormGroup>
            <FormControlLabel
              label={
                <Typography>
                  Declaro que li e concordo com os{' '}
                  <Link href="/termos">Termos</Link> e{' '}
                  <Link href="/termos">Políticas de Privacidade</Link> do site.
                </Typography>
              }
              control={
                <Checkbox
                  checked={termosAceitos}
                  onChange={(e) => setTermosAceitos(e.target.checked)}
                />
              }
              disabled={!ehCriacao}
            />

            <FormControlLabel
              label={
                <Typography>
                  Desejo ser notificado com ofertas e novidades.
                </Typography>
              }
              control={
                <Checkbox
                  checked={!!usuario.notificacoes}
                  onChange={(_, c) =>
                    usuario &&
                    setUsuario({
                      ...usuario,
                      notificacoes: c,
                    })
                  }
                />
              }
            />
          </FormGroup>

          <Button
            fullWidth
            variant="contained"
            onClick={() => salvarUsuario()}
            disabled={
              !termosAceitos || !!erroWhatsapp?.erro || !!erroNome?.erro
            }
          >
            Salvar
          </Button>
        </>
      )}
    </Stack>
  );
}
