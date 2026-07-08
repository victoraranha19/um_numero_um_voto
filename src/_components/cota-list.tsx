import { getCotas } from '@api/actions';
import { ICotaList } from '@lib/types';
import { Box, Chip, Grid, Pagination } from '@mui/material';
import { useEffect, useState } from 'react';

export default function CotaList() {
  const cotasPorPagina = 100;
  const [primeiroNumero, setPrimeiroNumero] = useState(1);
  const [cotas, setCotas] = useState<ICotaList[]>([]);

  function handlePageChange(pagina: number) {
    setPrimeiroNumero((pagina - 1) * cotasPorPagina + 1);
  }

  useEffect(() => {
    getCotas(primeiroNumero, primeiroNumero + cotasPorPagina - 1).then((c) =>
      setCotas(c),
    );
  }, [primeiroNumero]);

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={1} columns={5} sx={{ p: 1 }}>
        {Array.from(Array(cotasPorPagina), (_, index) => {
          const numero = index + primeiroNumero;
          const cota = cotas.find((v) => v.numero === numero);
          const color = !cota
            ? 'default'
            : !cota.foi_pago || !cota.sucesso
              ? 'warning'
              : 'success';
          return (
            <Grid
              key={numero}
              size={1}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Chip
                key={numero}
                label={numero.toString().padStart(4, '0')}
                color={color}
              />
            </Grid>
          );
        })}
      </Grid>

      <Pagination
        count={10}
        color="secondary"
        onChange={(_, p) => handlePageChange(p)}
      />
    </Box>
  );
}
