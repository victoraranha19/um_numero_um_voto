'use client';

import { addCota } from '@/_api/actions';
import { EPresidente } from '@/_lib/types';
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

import SelecaoRapida from './selecao-rapida';
import SelecaoManual from './selecao-manual';

export default function CotaForm() {
  const [presidente, setPresidente] = useState(EPresidente.BOLSONARO);
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
            onChange={(e) => setPresidente(e.target.value as EPresidente)}
          >
            <FormControlLabel value="B" control={<Radio />} label="Bolsonaro" />
            <FormControlLabel value="L" control={<Radio />} label="Lula" />
            <FormControlLabel value="N" control={<Radio />} label="Nenhum" />
          </RadioGroup>

          <SelecaoRapida numero={numero} setNumero={setNumero} />
          <SelecaoManual numero={numero} setNumero={setNumero} />

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
