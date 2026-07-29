'use client';

import { EMAIL_SITE } from '@lib/constants';
import { EmailRounded } from '@mui/icons-material';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';

export default function ContatoPage() {
  const [copiado, setCopiado] = useState(false);
  const [assunto, setAssunto] = useState<'' | EAssunto>('');

  function handleCopiar() {
    navigator.clipboard.writeText(EMAIL_SITE).then(() => {
      if (!copiado) {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      }
    });
  }

  function handleAssunto(e: SelectChangeEvent) {
    switch (e.target.value) {
      case EAssunto.DUVIDA:
        setAssunto(EAssunto.DUVIDA);
        break;
      case EAssunto.RECLAMACAO:
        setAssunto(EAssunto.RECLAMACAO);
        break;
      case EAssunto.SUGESTAO:
        setAssunto(EAssunto.SUGESTAO);
        break;
      default:
        setAssunto('');
        break;
    }
  }

  return (
    <Stack spacing={2}>
      <Card>
        <CardHeader title="Nosso contato" />
        <CardContent sx={{ pt: 0 }}>
          <Tooltip title={copiado ? 'Copiado' : 'Copiar email'}>
            <Card sx={{ borderRadius: 4 }}>
              <CardActionArea onClick={() => handleCopiar()}>
                <CardContent
                  sx={{ display: 'flex', gap: 1, alignItems: 'center', p: 1 }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 4,
                    }}
                  >
                    <EmailRounded fontSize="large" />
                  </Box>
                  <Stack>
                    <Typography variant="h6">Email</Typography>
                    <Typography variant="body2">{EMAIL_SITE}</Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Tooltip>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Envie uma mensagem" />
        <CardContent sx={{ pt: 0 }}>
          <Stack spacing={2}>
            <TextField fullWidth label="Nome Completo" />
            <TextField fullWidth label="Email" />
            <FormControl fullWidth>
              <InputLabel id="assunto-label">Assunto</InputLabel>
              <Select
                labelId="assunto-label"
                label="Assunto"
                onChange={handleAssunto}
                value={assunto}
              >
                <MenuItem value="">
                  <em>Selecione um assunto</em>
                </MenuItem>
                <MenuItem value={EAssunto.DUVIDA}>
                  {ASSUNTO[EAssunto.DUVIDA]}
                </MenuItem>
                <MenuItem value={EAssunto.SUGESTAO}>
                  {ASSUNTO[EAssunto.SUGESTAO]}
                </MenuItem>
                <MenuItem value={EAssunto.RECLAMACAO}>
                  {ASSUNTO[EAssunto.RECLAMACAO]}
                </MenuItem>
              </Select>
            </FormControl>
            <TextField fullWidth label="Mensagem" multiline rows={2} />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

enum EAssunto {
  DUVIDA = 'D',
  SUGESTAO = 'S',
  RECLAMACAO = 'R',
}

const ASSUNTO = {
  [EAssunto.DUVIDA]: 'Dúvida',
  [EAssunto.SUGESTAO]: 'Sugestão',
  [EAssunto.RECLAMACAO]: 'Reclamação',
};
