'use client';

import { auth } from '@/_api/auth';
import Login from '@/_components/login';
import Logout from '@/_components/logout';
import Revisao from '@/_components/revisao';
import {
  criarPedido,
  getQuantidadePedidosUsuario,
  getUrlPagamentoPedidoPendente,
} from '@/app/api/transacoes/actions';
import {
  adicionarNovoUsuario,
  verificarEmailCadastrado,
} from '@/app/api/usuario/actions';
import { getJWTFromEmail } from '@/app/api/usuario/usuario.utils';
import { getURLPagamento } from '@api/actions';
import DadosForm from '@components/dados-form';
import Pagamento from '@components/pagamento';
import { HANDLE, PRESIDENTE, PRICE, WEBHOOK_URL } from '@lib/constants';
import { EPresidente, IPayload, ITransacao, IUsuario } from '@lib/types';
import { Step, StepLabel, Stepper } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

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
  const [passo, setPasso] = useState<EPasso>(EPasso.IDENTIFICACAO);
  const [urlPagamento, setUrlPagamento] = useState<string>('');
  const [pedido, setPedido] = useState<ITransacao | null>(null);
  const [usuario, setUsuario] = useState<IUsuario | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUsuario(null);
        cookieStore.delete('tokenX');
        return;
      }
      verificarEmailCadastrado(user.email!)
        .then((v) => {
          if (!v) {
            const novoUsuario: IUsuario = {
              email: user.email!,
              nome: user.displayName ?? '',
              telefone: '',
              whatsapp: '',
            };
            adicionarNovoUsuario(novoUsuario).then(() =>
              setUsuario(novoUsuario),
            );
            return;
          }
          fetch(`/api/usuario?email=${user.email!}`, { method: 'GET' })
            .then((u) => u.json())
            .then(([u]: IUsuario[]) => setUsuario(u));
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
    });
  }, [searchParams]);

  async function irParaPagamento() {
    setPasso(EPasso.PAGAMENTO);
    const payload: IPayload = {
      handle: HANDLE,
      webhook_url: WEBHOOK_URL,
      items: [
        {
          description: `Voto(s) para ${PRESIDENTE[presidente]}`,
          price: PRICE,
          quantity: quantidade,
        },
      ],
    };
    if (!usuario) throw new Error('Usuário não reconhecido.');
    function getPhoneNumber(t1?: string, t2?: string) {
      if (t1 && t1.length) return '+55'.concat(t1.replaceAll(/\D/g, ''));
      if (t2 && t2.length) return '+55'.concat(t2.replaceAll(/\D/g, ''));
      return undefined;
    }
    payload.customer = {
      email: usuario.email,
      name: usuario.nome,
      phone_number: getPhoneNumber(usuario.whatsapp, usuario.telefone),
    };
    const quantidadePedidos = await getQuantidadePedidosUsuario(usuario.email);
    payload.order_nsu = `${usuario.email}#${quantidadePedidos + 1}`;

    let url_pagamento = await getUrlPagamentoPedidoPendente(payload);
    if (!url_pagamento.length) {
      url_pagamento = await getURLPagamento(payload);
      await criarPedido({
        email_usuario: usuario.email,
        order_nsu: payload.order_nsu,
        quantidade,
        url_pagamento,
        valor_total: PRICE * quantidade,
        presidente,
      });
    }
    setUrlPagamento(url_pagamento);
    window.open(url_pagamento);
  }

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
