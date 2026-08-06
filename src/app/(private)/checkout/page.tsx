'use client';

import { getURLPagamento } from '@api/actions';
import {
  criarPedido,
  getPedidoPendente,
  salvarUrlPedido,
} from '@app/api/pedido/actions';
import Redirecting from '@components/redirecting';
import Revisao from '@components/revisao';
import {
  HANDLE,
  PRESIDENTE,
  PRICE,
  REDIRECT_URL,
  SITE_URL,
  WEBHOOK_URL,
} from '@lib/constants';
import { EPresidente } from '@lib/enums';
import {
  IPayload,
  IPayloadCustomer,
  IPedido,
  IReciboDetalhado,
  IUsuario,
} from '@lib/types';
import { goToLoginWithRedirect } from '@lib/utils';
import { Divider, Step, StepLabel, Stepper } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const presidente = searchParams.get('p') as EPresidente;
  const quantidade = parseInt(searchParams.get('q') ?? '0');

  const transaction_id = searchParams.get('transaction_id');
  const transaction_nsu = searchParams.get('transaction_nsu');
  const id_recibo = transaction_id ?? transaction_nsu;

  const [passo, setPasso] = useState<EPasso>(EPasso.IDENTIFICACAO);
  const [urlPagamento, setUrlPagamento] = useState<string>('');
  const [usuario, setUsuario] = useState<IUsuario | null>(null);
  const [recibo, setRecibo] = useState<IReciboDetalhado | null>(null);

  const getPayloadCostumer = useCallback(
    (u: IUsuario): Partial<IPayloadCustomer> | undefined => {
      const phone_number = '+55'.concat(u.whatsapp);
      if (!u && !phone_number) return undefined;
      return {
        email: u.email,
        name: u.nome,
        phone_number,
      };
    },
    [],
  );

  const getPayload = useCallback(
    (p: EPresidente, q: number, u: IUsuario, order_nsu: string): IPayload => {
      const payload: IPayload = {
        handle: HANDLE,
        webhook_url: WEBHOOK_URL,
        redirect_url: REDIRECT_URL,
        items: [
          {
            description: `Voto(s) para ${PRESIDENTE[p]}`,
            price: PRICE,
            quantity: q,
          },
        ],
        customer: getPayloadCostumer(u),
        order_nsu,
      };
      return payload;
    },
    [getPayloadCostumer],
  );

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
      .then((u) => u.json())
      .then((u: IUsuario[]) => {
        const usuarioDB = u.at(0);
        if (!usuarioDB) {
          throw new Error('Usuário não encontrado no banco de dados');
        }
        setUsuario(usuarioDB);

        if (id_recibo) {
          setPasso(EPasso.REVISAO);
          return fetch(`/api/recibo/${id_recibo}`, { method: 'GET', headers })
            .then((r) => r.json())
            .then(([r]: IReciboDetalhado[]) => {
              if (!r) throw new Error('Pedido sem pagamento');
              setRecibo(r);
            })
            .catch((error) => {
              console.error('Erro ao consultar recibo do pedido', error);
              setPasso(EPasso.PAGAMENTO);
            });
        }

        return getPedidoPendente(quantidade, presidente)
          .then(([pedido]) => {
            if (pedido) return Promise.resolve(pedido.url);

            let url_pagamento = '';
            let order_nsu = '';
            const novoPedido: Omit<IPedido, 'id'> = {
              email_usuario: usuarioDB.email,
              quantidade,
              url: '',
              valor: PRICE * quantidade,
              presidente: presidente,
            };
            return criarPedido(novoPedido)
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
  }, [getPayload, id_recibo, presidente, quantidade, searchParams, usuario]);

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

      {usuario ? (
        <>
          {recibo ? (
            <Revisao recibo={recibo} />
          ) : (
            <Redirecting nomePagina="Pagamento" url={urlPagamento} />
          )}
        </>
      ) : (
        <Redirecting
          nomePagina="Login"
          url={goToLoginWithRedirect('checkout', searchParams.toString())}
        />
      )}
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Carregando checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

enum EPasso {
  IDENTIFICACAO = 0,
  PAGAMENTO = 1,
  REVISAO = 2,
}
