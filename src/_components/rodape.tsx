import { Box, Link, Stack, Typography } from '@mui/material';

export default function Rodape() {
  return (
    <>
      <Stack
        direction="row"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: 2,
          mb: 2,
        }}
      >
        <Stack>
          <Typography variant="h6">Links rápidos</Typography>
          <Link href="/" underline="none">
            Início
          </Link>
          <Link href="/sobre" underline="none">
            Quem Somos
          </Link>
          <Link href="/regras" underline="none">
            Regras da Premiação
          </Link>
          <Link href="/resultado" underline="none">
            Ganhadores
          </Link>
          <Link href="/termos" underline="none">
            Termos e Condições de Uso
          </Link>
          <Link href="/privacidade" underline="none">
            Política de Privacidade
          </Link>
        </Stack>
        <Stack>
          <Typography variant="h6">Contato</Typography>
          <Link href="/contato" underline="none">
            Fale Conosco
          </Link>
        </Stack>
      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, px: 2 }}>
        <Typography>
          &copy; 2026 Um número um voto: Todos os direitos reservados
        </Typography>
      </Box>
    </>
  );
}
