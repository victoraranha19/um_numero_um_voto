import { Delete, LocalActivityRounded } from '@mui/icons-material';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

interface SelecaoRapidaProps {
  maximoSelecao: number;
  quantidadeSelecionada: number;
  setQuantidadeSelecionada: (n: number) => void;
  adicionarNovasCotas: (q: number) => void;
  definirCotas: (q: number) => void;
}

export default function SelecaoRapida({
  maximoSelecao,
  quantidadeSelecionada,
  setQuantidadeSelecionada,
  adicionarNovasCotas,
  definirCotas,
}: SelecaoRapidaProps) {
  const [outro, setOutro] = useState(quantidadeSelecionada.toString());

  function handleAdicionarCotas(value: number) {
    if (isNaN(value)) return;
    const soma = quantidadeSelecionada + value;
    const novoNumero = soma > maximoSelecao ? maximoSelecao : soma;
    setQuantidadeSelecionada(novoNumero);
    setOutro(novoNumero.toString());
    adicionarNovasCotas(value);
  }

  function handleTextField(value: string) {
    if (!value) handleLimpar();
    const numero = parseInt(value);
    if (isNaN(numero)) return;
    const novoNumero = numero > maximoSelecao ? maximoSelecao : numero;
    setQuantidadeSelecionada(novoNumero);
    setOutro(novoNumero.toString());
    definirCotas(novoNumero);
  }

  function handleLimpar() {
    setQuantidadeSelecionada(0);
    setOutro('');
    definirCotas(0);
  }

  return (
    <>
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between', py: 1 }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <LocalActivityRounded fontSize="small" />
          <Typography>Seus votos:</Typography>
        </Box>

        {quantidadeSelecionada !== 0 && (
          <Button
            color="error"
            startIcon={<Delete />}
            onClick={() => handleLimpar()}
          >
            Limpar ({quantidadeSelecionada})
          </Button>
        )}
      </Stack>

      <Box sx={{ display: 'flex', gap: 1, p: 1 }}>
        <Button
          variant="contained"
          onClick={() => handleAdicionarCotas(5)}
          size="small"
        >
          + 5 votos
        </Button>
        <Button
          variant="contained"
          onClick={() => handleAdicionarCotas(10)}
          size="small"
        >
          + 10 votos
        </Button>
        <Button
          variant="contained"
          onClick={() => handleAdicionarCotas(50)}
          size="small"
        >
          + 50 votos
        </Button>
        <Button
          variant="contained"
          onClick={() => handleAdicionarCotas(100)}
          size="small"
        >
          + 100 votos
        </Button>

        <TextField
          value={outro ?? ''}
          placeholder="Outro"
          onChange={(e) => handleTextField(e.target.value)}
        />
      </Box>
    </>
  );
}
