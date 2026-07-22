'use client';

import { getURLPagamento } from '@api/actions';
import { auth } from '@api/auth';
import {
  criarPedido,
  getQuantidadePedidosUsuario,
  getUrlPagamentoPedidoPendente,
} from '@app/api/_pedido/actions';
import { adicionarNovoUsuario } from '@app/api/usuario/actions';
import DadosForm from '@components/dados-form';
import Pagamento from '@components/pagamento';
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
import { getJWTFromEmail } from '@lib/utils';
import { CircularProgress, Step, StepLabel, Stepper } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
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
  const [loading, setLoading] = useState<boolean>(true);

  function getPhoneNumber(t1?: string, t2?: string): string | undefined {
    if (t1 && t1.length) return '+55'.concat(t1.replaceAll(/\D/g, ''));
    if (t2 && t2.length) return '+55'.concat(t2.replaceAll(/\D/g, ''));
    return undefined;
  }

  const getPayloadCostumer = useCallback(
    (u: IUsuario): Partial<IPayloadCustomer> | undefined => {
      const phone_number = getPhoneNumber(u.whatsapp);
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

  const irParaPagamento = useCallback(
    async (p = presidente, q = quantidade, u = usuario) => {
      if (!u) {
        setPasso(EPasso.IDENTIFICACAO);
        return;
      }

      setPasso(EPasso.PAGAMENTO);
      let url_pagamento = await getUrlPagamentoPedidoPendente(q);
      if (!url_pagamento.length) {
        const quantidadePedidos = await getQuantidadePedidosUsuario(u.email);
        const payload = getPayload(p, q, u, quantidadePedidos + 1);
        url_pagamento = await getURLPagamento(payload);
        await criarPedido({
          email_usuario: u.email,
          id: payload.order_nsu,
          quantidade: q,
          url_pagamento,
          valor_total: PRICE * q, // usando o 'q' local com segurança
          presidente: p,
        });
      }
      setUrlPagamento(url_pagamento);
      window.open(url_pagamento);
    },
    [presidente, quantidade, usuario, getPayload],
  );

  useEffect(() => {
    if (!(order_nsu || (presidente && quantidade))) {
      window.location.href = SITE_URL;
      return;
    }

    onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUsuario(null);
        cookieStore.delete('tokenX');
        setLoading(false);
        return;
      }
      cookieStore.set('tokenX', getJWTFromEmail(user.email!));
      fetch(`/api/usuario?email=${user.email!}`, { method: 'GET' })
        .then((u) => u.json())
        .then((u: IUsuario[]) => {
          const usuarioDB = u.at(0);
          if (!usuarioDB) {
            const novoUsuario: IUsuario = {
              email: user.email!,
              nome: user.displayName ?? '',
              whatsapp: '',
            };
            return adicionarNovoUsuario(novoUsuario).then(() => {
              setUsuario(novoUsuario);
              setPasso(EPasso.IDENTIFICACAO);
            });
          }

          setUsuario(usuarioDB);
          if (!usuarioDB.whatsapp) {
            setPasso(EPasso.IDENTIFICACAO);
            return Promise.resolve();
          }

          if (order_nsu) {
            return Promise.resolve();
          }

          return getUrlPagamentoPedidoPendente(quantidade)
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
                    url_pagamento,
                    valor_total: PRICE * quantidade, // usando o 'q' local com segurança
                    presidente: presidente,
                  });
                })
                .then(() => Promise.resolve(url_pagamento));
            })
            .then((url) => {
              setUrlPagamento(url);
              window.open(url);
            });
        })
        .then(() => setLoading(false))
        .catch(() => cookieStore.delete('tokenX'));
    });
  }, [getPayload, order_nsu, presidente, quantidade]);

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        usuario && (
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
            {passo === EPasso.IDENTIFICACAO && (
              <DadosForm
                usuario={usuario}
                setUsuario={setUsuario}
                irParaProximoPasso={() => irParaPagamento()}
              />
            )}
            {passo === EPasso.PAGAMENTO && <Pagamento url={urlPagamento} />}
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
        )
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
