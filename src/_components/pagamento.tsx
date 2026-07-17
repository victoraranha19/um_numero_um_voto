import {
  Button,
  Card,
  CardActions,
  CardContent,
  Link,
  Typography,
} from '@mui/material';

interface PagamentoProps {
  url: string;
}

export default function Pagamento({ url }: PagamentoProps) {
  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="body1" gutterBottom>
            Um instante, redirecionando para o pagamento...
          </Typography>

          <Typography gutterBottom variant="caption">
            Se a página não abrir, utilize o link abaixo:
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center' }}>
          <Link variant="body2" component="a" href={url} target="_blank">
            Ir para pagamento
          </Link>
        </CardActions>
      </Card>
    </>
  );
}
