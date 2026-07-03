'use client';

import { Check } from '@mui/icons-material';
import {
  Alert,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

import { useState } from 'react';
import { addCota } from '@/api/actions';
import CampoNumero from './campo-numero';

export default function CotaForm() {
  const [presidente, setPresidente] = useState('bolsonaro');
  const [alerta, setAlerta] = useState(false);
  const [numero, setNumero] = useState(1);

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
          <FormLabel id="presidente-label">
            Qual presidente merece votos?
          </FormLabel>
          <RadioGroup
            aria-labelledby="presidente-label"
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

          <CampoNumero numero={numero} setNumero={setNumero} />

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
