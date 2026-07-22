import { Delete, ThumbUpAlt, ThumbUpOffAlt } from '@mui/icons-material';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

interface SelecaoRapidaProps {
  maximoSelecao: number;
  quantidadeSelecionada: number;
  setQuantidadeSelecionada: (n: number) => void;
}

export default function SelecaoRapida({
  maximoSelecao,
  quantidadeSelecionada,
  setQuantidadeSelecionada,
}: SelecaoRapidaProps) {
  const [outro, setOutro] = useState(quantidadeSelecionada.toString());

  function handleAdicionarCotas(value: number) {
    if (isNaN(value)) return;
    const soma = quantidadeSelecionada + value;
    const novoNumero = soma > maximoSelecao ? maximoSelecao : soma;
    setQuantidadeSelecionada(novoNumero);
    setOutro(novoNumero.toString());
  }

  function handleTextField(value: string) {
    if (!value) handleLimpar();
    const numero = parseInt(value);
    if (isNaN(numero)) return;
    const novoNumero = numero > maximoSelecao ? maximoSelecao : numero;
    setQuantidadeSelecionada(novoNumero);
    setOutro(novoNumero.toString());
  }

  function handleLimpar() {
    setQuantidadeSelecionada(0);
    setOutro('');
  }

  return (
    <>
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between', py: 1 }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {quantidadeSelecionada < 1 ? <ThumbUpOffAlt /> : <ThumbUpAlt />}
          <Typography>Quantos votos?</Typography>
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

      <Stack direction="row" spacing={1}>
        <TextField
          value={outro !== '0' ? outro : ''}
          placeholder="Digite um número"
          onChange={(e) => handleTextField(e.target.value)}
        />

        <Button
          variant="contained"
          onClick={() => handleAdicionarCotas(5)}
          sx={{ fontSize: { sm: 12, md: 14 } }}
          size="small"
          color="secondary"
        >
          + 5 votos
        </Button>
        <Button
          variant="contained"
          onClick={() => handleAdicionarCotas(10)}
          sx={{ fontSize: { sm: 12, md: 14 } }}
          size="small"
          color="secondary"
        >
          + 10 votos
        </Button>
        <Button
          variant="contained"
          onClick={() => handleAdicionarCotas(50)}
          sx={{ fontSize: { sm: 12, md: 14 } }}
          size="small"
          color="secondary"
        >
          + 50 votos
        </Button>
        <Button
          variant="contained"
          onClick={() => handleAdicionarCotas(100)}
          sx={{ fontSize: { sm: 12, md: 14 } }}
          size="small"
          color="secondary"
        >
          + 100 votos
        </Button>
      </Stack>
    </>
  );
}
