import { Box, Link, Stack, Typography } from '@mui/material';

export default function Rodape() {
  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Um número um voto &trade;</Typography>
      </Box>
      <Stack
        direction="row"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          my: 2,
        }}
      >
        <Stack>
          <Typography variant="body1">Nosso site</Typography>
          <Link variant="body2" href="/" underline="none">
            Início
          </Link>
          <Link variant="body2" href="/sobre" underline="none">
            Quem Somos
          </Link>
          <Link variant="body2" href="/termos" underline="none">
            Termos de Uso
          </Link>
          <Link variant="body2" href="/privacidade" underline="none">
            Política de Privacidade
          </Link>
        </Stack>
        <Stack>
          <Typography variant="body1">Sobre o Jogo</Typography>
          <Link variant="body2" href="/rifa" underline="none">
            Participar
          </Link>
          <Link variant="body2" href="/regras" underline="none">
            Regras
          </Link>
          <Link variant="body2" href="/resultado" underline="none">
            Ganhadores
          </Link>
        </Stack>
        <Stack>
          <Typography variant="body1">Contato</Typography>
          <Link variant="body2" href="/contato" underline="none">
            Fale Conosco
          </Link>
        </Stack>
      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Typography variant="body1">
          &copy; 2026 - Todos os direitos reservados
        </Typography>
      </Box>
    </>
  );
}
