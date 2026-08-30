'use client';

import { logout } from '@api/auth';
import { deletarPedido } from '@app/api/pedido/actions';
import { PRESIDENTE } from '@lib/constants';
import { IPedido, IUsuario } from '@lib/types';
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

  useEffect(() => {
    const tokenX = sessionStorage.getItem('tokenX');
    const headers = new Headers();
    if (tokenX) headers.set('Authorization', `Basic ${tokenX}`);

    fetch(`/api/usuario`, { method: 'GET', headers })
      .then((u) => {
        if (u.status === 401) location.href = location.origin;
        if (u.status === 403) {
          logout();
          location.href = location.origin;
        }
        return u.json();
      })
      .then((u: IUsuario[]) => {
        const usuarioDB = u.at(0);
        if (!usuarioDB) {
          throw new Error('Usuário não encontrado no banco de dados');
        }
        fetch(`/api/pedido?email=${usuarioDB.email}`, {
          method: 'GET',
          headers,
        })
          .then((p) => {
            if (p.status === 401) location.href = location.origin;
            if (p.status === 403) {
              logout();
              location.href = location.origin;
            }
            return p.json();
          })
          .then((p: IPedido[]) => {
            setPedidos(p);
          })
          .catch((error) => {
            console.error('Erro ao buscar pedidos:', error);
          });
      })
      .catch((error) => {
        console.error('Erro ao buscar pedidos:', error);
        logout();
        window.location.href = '/login';
      });
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
