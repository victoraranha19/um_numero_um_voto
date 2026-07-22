import { EPresidente } from '@lib/enums';
import {
  EmojiFlagsRounded,
  FlagRounded,
  OutlinedFlag,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from '@mui/material';

interface PresidenteFormProps {
  presidente: EPresidente;
  setPresidente: (p: EPresidente) => void;
}

export default function PresidenteForm({
  presidente,
  setPresidente,
}: PresidenteFormProps) {
  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {presidente === EPresidente.NENHUM ? <OutlinedFlag /> : <FlagRounded />}
        <Typography sx={{ py: 1 }}>Escolha um presidente:</Typography>
      </Box>
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
        <Card sx={{ width: 200 }} raised={presidente === EPresidente.BOLSONARO}>
          <CardActionArea onClick={() => setPresidente(EPresidente.BOLSONARO)}>
            <CardMedia
              component="img"
              image="/flavio-bolsonaro.jpg"
              title="Flávio Bolsonaro"
            />
            <CardContent
              sx={{ height: 64, py: 1, display: 'flex', alignItems: 'center' }}
            >
              <Typography
                variant="button"
                sx={{ fontSize: { xs: 12, sm: 14 } }}
              >
                Flávio Bolsonaro
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card sx={{ width: 200 }} raised={presidente === EPresidente.LULA}>
          <CardActionArea onClick={() => setPresidente(EPresidente.LULA)}>
            <CardMedia component="img" image="/lula.jpg" title="Lula" />
            <CardContent
              sx={{ height: 64, py: 1, display: 'flex', alignItems: 'center' }}
            >
              <Typography
                variant="button"
                sx={{ fontSize: { xs: 12, sm: 14 } }}
              >
                Lula
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card sx={{ width: 200 }} raised={presidente === EPresidente.NENHUM}>
          <CardActionArea onClick={() => setPresidente(EPresidente.NENHUM)}>
            <CardMedia component="img" image="/nulo.jpg" title="Nulo/Branco" />
            <CardContent
              sx={{ height: 64, py: 1, display: 'flex', alignItems: 'center' }}
            >
              <Typography
                variant="button"
                sx={{ fontSize: { xs: 12, sm: 14 } }}
              >
                Nenhum
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Stack>
    </>
  );
}
