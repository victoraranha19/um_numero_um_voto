'use client';

import IconText from '@components/icon-text';
import { EMAIL_SITE } from '@lib/constants';
import { EmailRounded } from '@mui/icons-material';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
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
      <Box>
        <Typography variant="h6">Nosso contato</Typography>
        <IconText
          icon={<EmailRounded fontSize="large" />}
          label="Email"
          caption={EMAIL_SITE}
          tooltip={copiado ? 'Copiado' : 'Copiar email'}
          onClick={() => handleCopiar()}
        />
      </Box>

      <Box>
        <Typography variant="h6">Envie uma mensagem</Typography>
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
      </Box>
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
