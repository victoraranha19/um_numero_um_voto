'use client';
import { getURLPagamento } from '@api/actions';
import { logout } from '@api/auth';
import {
  criarPedido,
  getPedidoByRecibo,
  getPedidoPendente,
  salvarUrlPedido,
} from '@app/api/pedido/actions';
import Carregando from '@components/carregando';
import Redirecting from '@components/redirecting';
import Revisao from '@components/revisao';
import { SITE_URL } from '@lib/constants';
import { EPresidente } from '@lib/enums';
import { IPedido, IUsuario } from '@lib/types';
import { getPayload, getValorCotas, goToLoginWithRedirect } from '@lib/utils';
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

  useEffect(() => {
    if (!(id_recibo || (presidente && quantidade))) {
      window.location.href = SITE_URL;
      return;
    }
    if (usuario) return;

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
        setUsuario(usuarioDB);

        if (id_recibo) {
          setPasso(EPasso.REVISAO);
          return getPedidoByRecibo(id_recibo, usuarioDB.email)
            .then((r) => {
              if (r) setPedido(r);
              else setPasso(EPasso.PAGAMENTO);
            })
            .catch((error) => {
              console.error('Erro ao consultar recibo do pedido', error);
            });
        }

        return getPedidoPendente(quantidade, presidente, usuarioDB.email)
          .then((pedido) => {
            if (pedido) return Promise.resolve(pedido.url);

            let url_pagamento = '';
            let order_nsu = '';
            return criarPedido({
              email_usuario: usuarioDB.email,
              presidente,
              quantidade,
              valor: getValorCotas(quantidade),
            })
              .then((id) => {
                const payload = getPayload(
                  presidente,
                  quantidade,
                  usuarioDB,
                  id,
                );
                order_nsu = id;
                return getURLPagamento(payload);
              })
              .then((up) => {
                url_pagamento = up;
                return salvarUrlPedido(order_nsu, up);
              })
              .then(() => Promise.resolve(url_pagamento));
          })
          .then((url) => {
            setPasso(EPasso.PAGAMENTO);
            setUrlPagamento(url);
            window.open(url);
          })
          .catch((error) => {
            console.error('Erro ao processar o pagamento:', error);
          });
      })
      .catch(() => {
        window.location.href = goToLoginWithRedirect(
          '/checkout',
          searchParams.toString(),
          window.location.origin,
        );
        setPasso(EPasso.IDENTIFICACAO);
      });
  }, [id_recibo, presidente, quantidade, searchParams, usuario]);

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
