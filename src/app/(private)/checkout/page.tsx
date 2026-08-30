'use client';
import { logout } from '@api/auth';
import {
  getPedidoByRecibo,
  getURLPedidoPendente,
} from '@app/api/pedido/actions';
import Carregando from '@components/carregando';
import Redirecting from '@components/redirecting';
import Revisao from '@components/revisao';
import { EPresidente } from '@lib/enums';
import { IPedido, IUsuario } from '@lib/types';
import { goToLoginWithRedirect } from '@lib/utils';
import { Divider, Step, StepLabel, Stepper } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const presidente = searchParams.get('p') as EPresidente;
  const quantidade = parseInt(searchParams.get('q') ?? '0');

  const transaction_id = searchParams.get('transaction_id');
  const transaction_nsu = searchParams.get('transaction_nsu');
  const id_recibo = transaction_id ?? transaction_nsu;

  const [passo, setPasso] = useState<EPasso>(EPasso.REVISAO);
  const [urlPagamento, setUrlPagamento] = useState<string>('');
  const [usuario, setUsuario] = useState<IUsuario | null>(null);
  const [pedido, setPedido] = useState<IPedido | null>(null);

  async function getUsuarioDB(headers: Headers): Promise<IUsuario> {
    const response = await fetch(`/api/usuario`, { method: 'GET', headers });
    let usuario: IUsuario | null;
    switch (response.status) {
      case 403:
      case 401:
        usuario = null;
        break;
      default:
        usuario = ((await response.json()) as IUsuario[])[0];
    }
    if (usuario === null) {
      throw new Error('Usuário não encontrado no banco de dados');
    }
    return usuario;
  }

  useEffect(() => {
    // Pagina sem searchParams
    if (!(id_recibo || (presidente && quantidade))) {
      location.href = location.origin;
    }
  }, [id_recibo, presidente, quantidade]);

  useEffect(() => {
    if (!searchParams) return;

    // Carregamento do usuario
    const tokenX = sessionStorage.getItem('tokenX');
    const headers = new Headers();
    if (tokenX) headers.set('Authorization', `Basic ${tokenX}`);
    getUsuarioDB(headers)
      .then((u) => setUsuario(u))
      .catch((error) => {
        setPasso(EPasso.IDENTIFICACAO);
        logout();
        location.href = goToLoginWithRedirect(
          '/checkout',
          searchParams.toString(),
        );
        console.error(error);
      });
  }, [searchParams]);

  useEffect(() => {
    if (!usuario) return;

    // Carregamento do pagamento/pedido
    if (id_recibo) {
      getPedidoByRecibo(id_recibo, usuario.email)
        .then((r) => setPedido(r))
        .catch((error) => console.error(error));
      return;
    }

    if (!presidente || !quantidade) return;
    getURLPedidoPendente(quantidade, presidente, usuario)
      .then((url) => {
        setPasso(EPasso.PAGAMENTO);
        setUrlPagamento(url);
        window.open(url);
      })
      .catch((error) => {
        console.error('Erro ao processar o pagamento:', error);
      });
  }, [id_recibo, presidente, quantidade, usuario]);

  return (
    <>
      <Stepper alternativeLabel activeStep={passo}>
        <Step>
          <StepLabel>Identificação</StepLabel>
        </Step>
        <Step>
          <StepLabel>Pagamento</StepLabel>
        </Step>
        <Step>
          <StepLabel>Revisão</StepLabel>
        </Step>
      </Stepper>

      <Divider sx={{ my: 3 }} />

      {passo === EPasso.IDENTIFICACAO &&
        (!usuario || !searchParams ? (
          <Redirecting
            nomePagina="Login"
            url={goToLoginWithRedirect('checkout', searchParams.toString())}
          />
        ) : (
          <Carregando />
        ))}

      {passo === EPasso.PAGAMENTO &&
        (usuario && urlPagamento ? (
          <Redirecting nomePagina="Pagamento" url={urlPagamento} />
        ) : (
          <Carregando />
        ))}

      {passo === EPasso.REVISAO &&
        (usuario && pedido && pedido.recibo_id ? (
          <Revisao pedido={pedido} />
        ) : (
          <Carregando />
        ))}
    </>
  );
}

enum EPasso {
  IDENTIFICACAO = 0,
  PAGAMENTO = 1,
  REVISAO = 2,
}
