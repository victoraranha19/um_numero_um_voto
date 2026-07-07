import { Delete, Shuffle } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

interface SelecaoRapidaProps {
  max?: number;
  numero: number;
  setNumero: (value: number) => void;
}

export default function SelecaoRapida({
  max = 200,
  numero,
  setNumero,
}: SelecaoRapidaProps) {
  const [outro, setOutro] = useState(numero.toString());

  function somaNumero(value: number) {
    if (isNaN(value)) return;
    const soma = numero + value;
    const novoNumero = soma > max ? max : soma;
    setNumero(novoNumero);
    setOutro(novoNumero.toString());
  }

  function handleTextField(value: string) {
    if (!value) handleLimpar();
    const numero = parseInt(value);
    if (isNaN(numero)) return;
    const novoNumero = numero > max ? max : numero;
    setNumero(novoNumero);
    setOutro(novoNumero.toString());
  }

  function handleLimpar() {
    setNumero(0);
    setOutro('');
  }

  return (
    <Card>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Shuffle fontSize="small" />
          <Typography variant="button">Seleção rápida</Typography>
        </Box>
        {numero !== 0 && (
          <Button
            color="error"
            startIcon={<Delete />}
            onClick={() => handleLimpar()}
          >
            Limpar ({numero})
          </Button>
        )}
      </CardActions>

      <CardContent>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" onClick={() => somaNumero(5)}>
            + 5 votos
          </Button>
          <Button variant="contained" onClick={() => somaNumero(10)}>
            + 10 votos
          </Button>
          <Button variant="contained" onClick={() => somaNumero(50)}>
            + 50 votos
          </Button>
          <Button variant="contained" onClick={() => somaNumero(100)}>
            + 100 votos
          </Button>

          <TextField
            value={outro ?? ''}
            onChange={(e) => handleTextField(e.target.value)}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
