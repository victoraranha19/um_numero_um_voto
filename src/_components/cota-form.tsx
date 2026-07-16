'use client';

import { EPresidente } from '@lib/types';
import {
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useState } from 'react';

import CotasSelecionadas from './cotas-selecionadas';
import SelecaoRapida from './selecao-rapida';

interface CotaFormProps {
  cotasDisponiveis: number[];
  presidente: EPresidente;
  setPresidente: (p: EPresidente) => void;
  quantidade: number;
  setQuantidade: (q: number) => void;
}

export default function CotaForm({
  cotasDisponiveis,
  presidente,
  setPresidente,
  quantidade,
  setQuantidade,
}: CotaFormProps) {
  const [numerosSelecionados, setNumerosSelecionados] = useState<number[]>([]);

  function embaralharNumeros() {
    const novosNumeros = getNumerosAleatorios(
      cotasDisponiveis,
      numerosSelecionados.length,
    );
    setNumerosSelecionados(novosNumeros);
  }

  function adicionarNovasCotas(quantidadeNovasCotas: number) {
    const novosNumeros = getNumerosAleatorios(
      cotasDisponiveis,
      quantidadeNovasCotas,
      numerosSelecionados,
    );
    setNumerosSelecionados(novosNumeros);
  }

  function definirCotas(quantidadeCotas: number) {
    const novosNumeros = getNumerosAleatorios(
      cotasDisponiveis,
      quantidadeCotas,
    );
    setNumerosSelecionados(novosNumeros);
  }

  function getNumerosAleatorios(
    numerosDisponiveis: number[],
    qNumeros: number,
    ignorarNumeros: number[] = [],
  ): number[] {
    const nDisp = new Set<number>(
      numerosDisponiveis.filter((c) => ignorarNumeros.every((n) => n !== c)),
    );
    const novosNumeros = new Set<number>(ignorarNumeros);
    const qNovosNumeros = Math.min(qNumeros, nDisp.size);
    for (let n = 0; n < qNovosNumeros; n++) {
      const randomPos = Math.trunc(Math.random() * (nDisp.size - 1));
      const cota = [...nDisp][randomPos];
      if (!novosNumeros.has(cota)) {
        nDisp.delete(cota);
        novosNumeros.add(cota);
      }
    }
    return [...novosNumeros].sort((a, b) => a - b);
  }

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
          maximoSelecao={cotasDisponiveis.length}
          quantidadeSelecionada={quantidade}
          setQuantidadeSelecionada={setQuantidade}
          adicionarNovasCotas={adicionarNovasCotas}
          definirCotas={definirCotas}
        />
      </FormControl>

      <Divider sx={{ my: 2 }} />
      <CotasSelecionadas
        cotas={numerosSelecionados}
        cotasPorPagina={20}
        embaralharNumeros={embaralharNumeros}
        podeEmbaralhar={0 < quantidade && quantidade < cotasDisponiveis.length}
      />
    </>
  );
}
