import { CasinoRounded, ShuffleRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Grid,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';

interface ICotasSelecionadasProps {
  cotas: number[];
  cotasPorPagina: number;
  embaralharNumeros: () => void;
  podeEmbaralhar: boolean;
}

export default function CotasSelecionadas(props: ICotasSelecionadasProps) {
  const [pagina, setPagina] = useState(1);
  const total_paginas = Math.ceil(props.cotas.length / props.cotasPorPagina);

  return (
    <>
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between', py: 1 }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <CasinoRounded fontSize="small" />
          <Typography>Seus números:</Typography>
        </Box>
        <Button
          startIcon={<ShuffleRounded />}
          onClick={props.embaralharNumeros}
          disabled={!props.podeEmbaralhar}
        >
          Trocar
        </Button>
      </Stack>

      <Grid container spacing={1} columns={5} sx={{ p: 1 }}>
        {props.cotas
          .filter((_, i) => {
            const primeiroNumero = (pagina - 1) * props.cotasPorPagina;
            const ultimoNumero = primeiroNumero + props.cotasPorPagina;
            return primeiroNumero <= i && i < ultimoNumero;
          })
          .map((n) => (
            <Grid
              key={n}
              size={1}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Chip
                key={n}
                label={n.toString().padStart(4, '0')}
                color="success"
              />
            </Grid>
          ))}
      </Grid>
      {total_paginas > 1 && (
        <Pagination count={total_paginas} onChange={(_, p) => setPagina(p)} />
      )}
    </>
  );
}
