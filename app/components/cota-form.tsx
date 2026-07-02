'use client';

import { Check } from '@mui/icons-material';
import {
  Alert,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

import * as React from 'react';
import { addCota } from '@lib/actions';
import CampoNumero from './campo-numero';

export default function CotaForm() {
  const [presidente, setPresidente] = React.useState('bolsonaro');
  const [alerta, setAlerta] = React.useState(false);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    await addCota(presidente, 1);
    setAlerta(true);
    setTimeout(() => setAlerta(false), 2000);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <RadioGroup
            value={presidente}
            onChange={(e) => setPresidente(e.target.value)}
          >
            <FormControlLabel
              value="bolsonaro"
              control={<Radio />}
              label="Bolsonaro"
            />
            <FormControlLabel value="lula" control={<Radio />} label="Lula" />
            <FormControlLabel
              value="nenhum"
              control={<Radio />}
              label="Nenhum"
            />
          </RadioGroup>

          <CampoNumero />

          <Button type="submit" variant="contained" disabled={alerta}>
            Votar
          </Button>
        </FormControl>
      </form>

      {alerta && (
        <Alert icon={<Check fontSize="inherit" />} severity="success">
          Voto registrado com sucesso.
        </Alert>
      )}
    </>
  );
}
