'use client';

import { getURLPagamento } from '@api/actions';
import {
  criarPedido,
  getQuantidadePedidosUsuario,
  getUrlPagamentoPedidoPendente,
} from '@app/api/_pedido/actions';
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
import { IPayload, IPayloadCustomer, IUsuario } from '@lib/types';
import { Divider, Step, StepLabel, Stepper } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const presidente = searchParams.get('p') as EPresidente;
  const quantidade = parseInt(searchParams.get('q') ?? '0');
  const order_nsu = searchParams.get('order_nsu');
  const capture_method = searchParams.get('capture_method');
  const transaction_id = searchParams.get('transaction_id');
  const transaction_nsu = searchParams.get('transaction_nsu');
  const slug = searchParams.get('slug');
  const receipt_url = searchParams.get('receipt_url');

  const [passo, setPasso] = useState<EPasso>(
    order_nsu ? EPasso.REVISAO : EPasso.PAGAMENTO,
  );
  const [urlPagamento, setUrlPagamento] = useState<string>('');
  const [usuario, setUsuario] = useState<IUsuario | null>(null);

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
    (p: EPresidente, q: number, u: IUsuario, np: number): IPayload => {
      const order_nsu = `${np}#${crypto.randomUUID()}`;
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

  function geUrlRedirect(urlSite: string, searchParams: string): string {
    const url = new URL(`${urlSite}/login`);
    url.searchParams.set(
      'redirect',
      `${urlSite}/checkout?${encodeURIComponent(searchParams)}`,
    );
    return url.href;
  }

  useEffect(() => {
    if (!(order_nsu || (presidente && quantidade))) {
      window.location.href = SITE_URL;
      return;
    }

    fetch(`/api/usuario`, { method: 'GET' })
      .then((u) => u.json())
      .then((u: IUsuario[]) => {
        const usuarioDB = u.at(0);
        if (!usuarioDB) {
          throw new Error('Usuário não encontrado no banco de dados');
        }

        setUsuario(usuarioDB);
        if (order_nsu) {
          setPasso(EPasso.REVISAO);
          return Promise.resolve();
        }

        return getUrlPagamentoPedidoPendente(quantidade, presidente)
          .then((url) => {
            if (url && url.length) {
              return Promise.resolve(url);
            }
            let order_nsu = '';
            let url_pagamento = '';
            return getQuantidadePedidosUsuario(usuarioDB.email)
              .then((qp) => {
                const payload = getPayload(
                  presidente,
                  quantidade,
                  usuarioDB,
                  qp + 1,
                );
                order_nsu = payload.order_nsu;
                return getURLPagamento(payload);
              })
              .then((up) => {
                url_pagamento = up;
                return criarPedido({
                  email_usuario: usuarioDB.email,
                  id: order_nsu,
                  quantidade,
                  url: url_pagamento,
                  valor: PRICE * quantidade, // usando o 'q' local com segurança
                  presidente: presidente,
                });
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
        const urlSite = window.location.origin ?? SITE_URL;
        window.location.href = geUrlRedirect(urlSite, searchParams.toString());
        setPasso(EPasso.IDENTIFICACAO);
      });
  }, [getPayload, order_nsu, presidente, quantidade, searchParams]);

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

      {!usuario ||
        (passo === EPasso.IDENTIFICACAO && (
          <Redirecting
            nomePagina="Login"
            url={geUrlRedirect(
              window.location.origin ?? SITE_URL,
              searchParams.toString(),
            )}
          />
        ))}

      {usuario && (
        <>
          {passo === EPasso.PAGAMENTO && (
            <Redirecting nomePagina="Pagamento" url={urlPagamento} />
          )}
          {order_nsu?.length && (
            <Revisao
              order_nsu={order_nsu}
              capture_method={capture_method}
              transaction_nsu={transaction_nsu ?? transaction_id}
              slug={slug}
              receipt_url={receipt_url}
            />
          )}
        </>
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
