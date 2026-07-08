import { Shuffle, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';

import CotaList from './cota-list';
import { useState } from 'react';

interface SelecaoManualProps {
  numero: number;
  setNumero: (value: number) => void;
}

export default function SelecaoManual({
  numero,
  setNumero,
}: SelecaoManualProps) {
  const total = 1000;

  return (
    <Card>
      <CardContent>
        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Shuffle fontSize="small" />
            <Typography variant="h6">Seleção manual</Typography>
          </Box>
          <Typography variant="caption">
            {numero} de {total} (max)
          </Typography>
        </Stack>

        <CotaList />
      </CardContent>
    </Card>
  );
}
