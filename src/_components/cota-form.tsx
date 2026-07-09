'use client';

import { EPresidente } from '@lib/types';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useState } from 'react';

import SelecaoManual from './selecao-manual';
import SelecaoRapida from './selecao-rapida';

interface CotaFormProps {
  presidente: EPresidente;
  setPresidente: (p: EPresidente) => void;
  quantidade: number;
  setQuantidade: (q: number) => void;
}

export default function CotaForm({
  presidente,
  setPresidente,
  quantidade,
  setQuantidade,
}: CotaFormProps) {
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

          <Button variant="contained" disabled={!quantidade}>
            Votar
          </Button>
        </FormControl>
      </form>
    </>
  );
}
