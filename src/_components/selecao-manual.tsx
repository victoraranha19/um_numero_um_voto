import { Visibility } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Typography,
} from '@mui/material';

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
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Typography variant="caption">
          {total - numero} de {total} disponíveis
        </Typography>
        <Button startIcon={<Visibility />} onClick={() => setNumero(0)}>
          Somente disponíveis
        </Button>
      </CardActions>

      <CardContent>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip label="Clickable" />
          <Chip
            label="Clickable"
            variant="outlined"
            onClick={() => setNumero(1)}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
