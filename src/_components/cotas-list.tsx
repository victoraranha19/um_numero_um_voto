import { ICota } from '@lib/types';
import { CasinoRounded } from '@mui/icons-material';
import { Box, Chip, Grid, Pagination, Typography } from '@mui/material';
import { useState } from 'react';

interface ICotasListProps {
  cotas: ICota[];
  cotasPorPagina?: number;
}

export default function CotasList({
  cotas,
  cotasPorPagina = 20,
}: ICotasListProps) {
  const [pagina, setPagina] = useState(1);
  const total_paginas = Math.ceil(cotas.length / cotasPorPagina);

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <CasinoRounded fontSize="small" />
        <Typography>Seus números:</Typography>
      </Box>

      <Grid container spacing={1} columns={5} sx={{ p: 1 }}>
        {cotas
          .filter((_, i) => {
            const primeiroNumero = (pagina - 1) * cotasPorPagina;
            const ultimoNumero = primeiroNumero + cotasPorPagina;
            return primeiroNumero <= i && i < ultimoNumero;
          })
          .map((c) => (
            <Grid
              key={c.numero}
              size={1}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Chip
                key={c.numero}
                label={c.numero.toString().padStart(4, '0')}
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
