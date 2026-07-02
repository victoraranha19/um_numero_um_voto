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
import { addVoto } from '../lib/actions';

export default function VotoForm() {
  const [presidente, setPresidente] = React.useState('bolsonaro');
  const [alerta, setAlerta] = React.useState(false);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    await addVoto(presidente);
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

          <Button type="submit" variant="contained" disabled={alerta}>
            Votar
          </Button>
        </FormControl>
      </form>

      {alerta ? (
        <Alert icon={<Check fontSize="inherit" />} severity="success">
          Voto registrado com sucesso.
        </Alert>
      ) : null}
    </>
  );
}
