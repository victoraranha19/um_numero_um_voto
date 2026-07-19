'use client';

import { auth } from '@api/auth';
import Login from '@components/login';
import Logout from '@components/logout';
import Revisao from '@components/revisao';
import {
  criarPedido,
  getQuantidadePedidosUsuario,
  getUrlPagamentoPedidoPendente,
} from '@app/api/transacoes/actions';
import { adicionarNovoUsuario } from '@app/api/usuario/actions';
import { getJWTFromEmail } from '@app/api/usuario/usuario.utils';
import { getURLPagamento } from '@api/actions';
import DadosForm from '@components/dados-form';
import Pagamento from '@components/pagamento';
import {
  HANDLE,
  PRESIDENTE,
  PRICE,
  REDIRECT_URL,
  SITE_URL,
  WEBHOOK_URL,
} from '@lib/constants';
import {
  EPresidente,
  IPayload,
  ITransacao,
  IUsuario,
  IPayloadCustomer,
} from '@lib/types';
import { Step, StepLabel, Stepper } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const presidente = searchParams.get('p') as EPresidente;
  const quantidade = parseInt(searchParams.get('q') ?? '0');
  const order_nsu = searchParams.get('o');

  const [passo, setPasso] = useState<EPasso>(EPasso.PAGAMENTO);
  const [urlPagamento, setUrlPagamento] = useState<string>('');
  const [pedido, setPedido] = useState<ITransacao | null>(null);
  const [usuario, setUsuario] = useState<IUsuario | null>(null);

  function getPhoneNumber(t1?: string, t2?: string): string | undefined {
    if (t1 && t1.length) return '+55'.concat(t1.replaceAll(/\D/g, ''));
    if (t2 && t2.length) return '+55'.concat(t2.replaceAll(/\D/g, ''));
    return undefined;
  }

  const getPayloadCostumer = useCallback(
    (u: IUsuario): Partial<IPayloadCustomer> | undefined => {
      const phone_number = getPhoneNumber(u.whatsapp, u.telefone);
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
      const redirect_url = new URL(REDIRECT_URL);
      redirect_url.searchParams.set('o', order_nsu);
      const payload: IPayload = {
        handle: HANDLE,
        webhook_url: WEBHOOK_URL,
        redirect_url: redirect_url.href,
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
          order_nsu: payload.order_nsu,
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
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUsuario(null);
        cookieStore.delete('tokenX');
        return;
      }
      fetch(`/api/usuario?email=${user.email!}`, { method: 'GET' })
        .then((u) => u.json())
        .then(([u]: IUsuario[]) => {
          setUsuario(u ?? null);
          if (!u) {
            const novoUsuario: IUsuario = {
              email: user.email!,
              nome: user.displayName ?? '',
              telefone: '',
              whatsapp: '',
            };
            adicionarNovoUsuario(novoUsuario).then(() => {
              setUsuario(novoUsuario);
              setPasso(EPasso.IDENTIFICACAO);
            });
            return;
          }
          if (!u.telefone && !u.whatsapp) {
            setPasso(EPasso.IDENTIFICACAO);
            return;
          }

          if (order_nsu) {
            console.log('com order_nsu', order_nsu);
            const url = new URL('/api/transacoes');
            url.searchParams.set('id', order_nsu);
            fetch(url, { method: 'GET' })
              .then((r) => r.json())
              .then(([t]: ITransacao[]) => {
                if (!t) return;
                if (t.foi_pago) {
                  setPasso(EPasso.REVISAO);
                  setPedido(t);
                } else {
                  setPasso(EPasso.PAGAMENTO);
                  setUrlPagamento(t.url_pagamento);
                  window.open(t.url_pagamento);
                }
              });
            return;
          }

          console.log('sem order_nsu', order_nsu);
          if (!presidente || !quantidade) {
            console.log(
              'sem presidente, sem quantidade',
              presidente,
              quantidade,
            );
            window.location.href = SITE_URL;
            return;
          }

          getUrlPagamentoPedidoPendente(quantidade).then((url) => {
            if (url.length) {
              setUrlPagamento(url);
              window.open(url);
              return;
            }
            let order_nsu = '';
            let url_pagamento = '';
            getQuantidadePedidosUsuario(u.email)
              .then((qp) => {
                const payload = getPayload(presidente, quantidade, u, qp + 1);
                console.log(payload);
                order_nsu = payload.order_nsu;
                return getURLPagamento(payload);
              })
              .then((up) => {
                url_pagamento = up;
                return criarPedido({
                  email_usuario: u.email,
                  order_nsu,
                  quantidade,
                  url_pagamento,
                  valor_total: PRICE * quantidade, // usando o 'q' local com segurança
                  presidente: presidente,
                });
              })
              .then(() => {
                setUrlPagamento(url_pagamento);
                window.open(url_pagamento);
              });
          });
        })
        .then(() => cookieStore.set('tokenX', getJWTFromEmail(user.email!)))
        .catch(() => cookieStore.delete('tokenX'));
    });
  }, [getPayload, order_nsu, presidente, quantidade]);

  return (
    <>
      {usuario ? (
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
          {pedido && <Revisao pedido={pedido} />}
          <Logout />
        </>
      ) : (
        <Login />
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
