'use client';

import {
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import SelecaoRapida from './selecao-rapida';
import { EPresidente } from '@lib/enums';

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
      <FormControl>
        <FormLabel id="presidente-label">Escolha um presidente</FormLabel>
        <RadioGroup
          aria-labelledby="presidente-label"
          value={presidente}
          onChange={(e) => setPresidente(e.target.value as EPresidente)}
        >
          <FormControlLabel value="B" control={<Radio />} label="Bolsonaro" />
          <FormControlLabel value="L" control={<Radio />} label="Lula" />
          <FormControlLabel value="N" control={<Radio />} label="Nenhum" />
        </RadioGroup>

        <Divider sx={{ my: 2 }} />

        <SelecaoRapida
          maximoSelecao={500}
          quantidadeSelecionada={quantidade}
          setQuantidadeSelecionada={setQuantidade}
        />
      </FormControl>
    </>
  );
}
