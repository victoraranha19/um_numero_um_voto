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

import { EPresidente, IPayload } from '@lib/types';
import { CPRESIDENTE } from '@lib/constants';
import SelecaoRapida from './selecao-rapida';
import SelecaoManual from './selecao-manual';
import { getURLPagamento } from '@api/actions';

export default function CotaForm() {
  const [presidente, setPresidente] = useState(EPresidente.BOLSONARO);
  const [alerta, setAlerta] = useState(false);
  const [quantidade, setQuantidade] = useState(0);

  const handleSubmit = async () => {
    const request: IPayload = {
      handle: 'aranhavictor',
      items: [
        {
          description: `Voto(s) ${CPRESIDENTE[presidente].toLowerCase()}`,
          price: 100,
          quantity: quantidade,
        },
      ],
    };
    setAlerta(true);
    try {
      const url = await getURLPagamento(request);
      window.open(url, '_blank');
    } catch (error) {
      console.error(error);
    }
    setTimeout(() => setAlerta(false), 2000);
  };

  return (
    <>
      <form>
        <FormControl>
          <FormLabel id="presidente-label">
            Envie votos para seu presidente
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

          <SelecaoRapida numero={quantidade} setNumero={setQuantidade} />
          <SelecaoManual numero={quantidade} setNumero={setQuantidade} />

          <Button variant="contained" disabled={alerta} onClick={handleSubmit}>
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
