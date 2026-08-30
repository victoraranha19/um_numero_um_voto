'use client';

import { logout } from '@api/auth';
import { deletarPedido } from '@app/api/pedido/actions';
import { PRESIDENTE } from '@lib/constants';
import { IPedido } from '@lib/types';
import { goToLoginWithRedirect } from '@lib/utils';
import {
  DeleteRounded,
  ShoppingCartCheckoutRounded,
  VisibilityRounded,
} from '@mui/icons-material';
import {
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<IPedido[]>([]);

  async function getPedidosDB(headers: Headers): Promise<IPedido[]> {
    const response = await fetch(`/api/pedido`, { method: 'GET', headers });
    let pedidos: IPedido[] | null;
    switch (response.status) {
      case 403:
      case 401:
        logout();
        location.href = goToLoginWithRedirect('/pedidos');
        pedidos = null;
        break;
      default:
        pedidos = (await response.json()) as IPedido[];
    }
    if (pedidos === null) {
      throw new Error('Pedidos não encontrados no banco de dados');
    }
    return pedidos;
  }

  useEffect(() => {
    const tokenX = sessionStorage.getItem('tokenX');
    const headers = new Headers();
    if (tokenX) headers.set('Authorization', `Basic ${tokenX}`);

    getPedidosDB(headers)
      .then((p) => setPedidos(p))
      .catch((error) => console.error('Erro ao buscar pedidos:', error));
  }, []);

  async function handleDeletarPedido(pedidoId: string) {
    await deletarPedido(pedidoId);
    setPedidos(pedidos.filter((p) => p.id !== pedidoId));
  }

  function getUrlRecibo(id_pedido: string): string {
    const url = new URL(`${location.origin}/checkout`);
    url.searchParams.set('transaction_id', id_pedido);
    return url.href;
  }

  return (
    <>
      <Typography variant="h6" sx={{ my: 2 }}>
        Meus Pedidos ({pedidos.length})
      </Typography>
      <TableContainer component={Paper} sx={{ my: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="right">Pedido</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell align="right">Valor</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.map((pedido, index) => (
              <TableRow key={pedido.id}>
                <TableCell align="right">
                  <Typography sx={{ wordBreak: 'break-word' }}>
                    #{index + 1}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ textWrap: { xs: 'auto', md: 'nowrap' } }}>
                    {pedido.quantidade} cota(s) para{' '}
                    {PRESIDENTE[pedido.presidente]}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  R$ {(pedido.valor / 100).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {pedido.recibo_id ? (
                    <Tooltip
                      title="Detalhar pedido"
                      placement="top"
                      onClick={() =>
                        window.open(getUrlRecibo(pedido.recibo_id!))
                      }
                    >
                      <IconButton color="primary">
                        <VisibilityRounded />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Stack direction="row">
                      <Tooltip
                        title="Finalizar pagamento"
                        placement="top"
                        onClick={() => window.open(pedido.url)}
                      >
                        <IconButton color="primary">
                          <ShoppingCartCheckoutRounded />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title="Desistir do pedido"
                        placement="top"
                        onClick={() => handleDeletarPedido(pedido.id)}
                      >
                        <IconButton color="error">
                          <DeleteRounded />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
