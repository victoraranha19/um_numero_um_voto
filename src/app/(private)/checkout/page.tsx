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
import { HANDLE, PRESIDENTE, PRICE, WEBHOOK_URL } from '@lib/constants';
import {
  EPresidente,
  IPayload,
  ITransacao,
  IUsuario,
  IPayloadCustomer,
} from '@lib/types';
import { Step, StepLabel, Stepper } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';

type CheckoutSearchParams = Promise<{
  q?: string;
  p?: EPresidente;
  o?: string;
}>;

interface CheckoutPageProps {
  searchParams: CheckoutSearchParams;
}

export default function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const [presidente, setPresidente] = useState<EPresidente>(EPresidente.NENHUM);
  const [quantidade, setQuantidade] = useState<number>(1);
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
      const payload: IPayload = {
        handle: HANDLE,
        webhook_url: WEBHOOK_URL,
        items: [
          {
            description: `Voto(s) para ${PRESIDENTE[p]}`,
            price: PRICE,
            quantity: q,
          },
        ],
        customer: getPayloadCostumer(u),
        order_nsu: `${u.email}#${np}`,
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
          } else if (!u.telefone && !u.whatsapp) {
            setPasso(EPasso.IDENTIFICACAO);
          }
        })
        .then(() => cookieStore.set('tokenX', getJWTFromEmail(user.email!)))
        .catch(() => cookieStore.delete('tokenX'));
    });
  }, []);

  useEffect(() => {
    searchParams.then((s) => {
      if (s.o) {
        const url = new URL('/api/transacoes');
        url.searchParams.set('id', s.o);
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

      if (!s.p || !s.q) {
        const url = new URL(
          window.location.href.slice(
            0,
            window.location.href.indexOf('/checkout'),
          ),
        );
        window.location.href = url.href;
        return;
      }

      setPresidente(s.p);
      setQuantidade(parseInt(s.q));
      if (!usuario || !(usuario.telefone || usuario.whatsapp)) {
        setPasso(EPasso.IDENTIFICACAO);
        return;
      }
      console.log('tem');
      setPasso(EPasso.PAGAMENTO);
      getUrlPagamentoPedidoPendente(parseInt(s.q)).then((url) => {
        if (url.length) {
          setUrlPagamento(url);
          window.open(url);
          return;
        }
        let order_nsu = '';
        let url_pagamento = '';
        getQuantidadePedidosUsuario(usuario.email)
          .then((qp) => {
            const payload = getPayload(s.p!, parseInt(s.q!), usuario, qp + 1);
            order_nsu = payload.order_nsu;
            return getURLPagamento(payload);
          })
          .then((up) => {
            url_pagamento = up;
            return criarPedido({
              email_usuario: usuario.email,
              order_nsu,
              quantidade: parseInt(s.q!),
              url_pagamento,
              valor_total: PRICE * parseInt(s.q!), // usando o 'q' local com segurança
              presidente: s.p!,
            });
          })
          .then(() => {
            setUrlPagamento(url_pagamento);
            window.open(url_pagamento);
          });
      });
    });
  }, [searchParams, usuario, getPayload]);

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

enum EPasso {
  IDENTIFICACAO = 0,
  PAGAMENTO = 1,
  REVISAO = 2,
}
