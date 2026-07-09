'use client';

import { getURLPagamento } from '@api/actions';
import DadosForm from '@components/dados-form';
import Pagamento from '@components/pagamento';
import { PRESIDENTE, HANDLE, PRICE } from '@lib/constants';
import { EPresidente, IPayload, IUsuario } from '@lib/types';
import { Button, Step, StepLabel, Stepper } from '@mui/material';
import { useEffect, useState } from 'react';

type CheckoutSearchParams = Promise<{ q: string; p: EPresidente }>;

interface CheckoutPageProps {
  searchParams: CheckoutSearchParams;
}

export default function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const [presidente, setPresidente] = useState<EPresidente>(
    EPresidente.BOLSONARO,
  );
  const [quantidade, setQuantidade] = useState<number>(1);
  const [passo, setPasso] = useState<EPasso>(EPasso.IDENTIFICACAO);
  const [usuario, setUsuario] = useState<IUsuario | null>(null);
  const [urlPagamento, setUrlPagamento] = useState<string>('');

  useEffect(() => {
    fetch('/api/usuario', { method: 'GET' })
      .then((r) => r.json())
      .then(([u]: IUsuario[]) => {
        console.log('usuario from api', u);
        setUsuario(u);
      });
  }, []);

  useEffect(() => {
    searchParams.then((s) => {
      try {
        setPresidente(s.p);
        setQuantidade(parseInt(s.q));
      } catch (error) {
        console.error('Erro ao identificar parâmetros', error);
      }
    });
  }, [searchParams]);

  function irParaProximoPasso(passo: EPasso) {
    if (passo > EPasso.REVISAO) return;
    setPasso(passo);
  }

  async function irParaPagamento(p: EPasso) {
    irParaProximoPasso((p + 1) as EPasso);
    const payload: IPayload = {
      handle: HANDLE,
      items: [
        {
          description: `Voto(s) para ${PRESIDENTE[presidente]}`,
          price: PRICE,
          quantity: quantidade,
        },
      ],
    };
    if (usuario) {
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
      console.log(payload);
    }
    const url = await getURLPagamento(payload);
    setUrlPagamento(url);
    window.open(url);
  }

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

      {passo === EPasso.IDENTIFICACAO && (
        <DadosForm
          usuario={usuario}
          setUsuario={setUsuario}
          irParaProximoPasso={() => irParaPagamento(passo)}
        />
      )}
      {passo === EPasso.PAGAMENTO && (
        <Pagamento
          url={urlPagamento}
          irParaProximoPasso={() => irParaProximoPasso(passo)}
        />
      )}
      {passo === EPasso.REVISAO && (
        <Button variant="contained" onClick={() => irParaProximoPasso(passo)}>
          Completar
        </Button>
      )}
    </>
  );
}

enum EPasso {
  IDENTIFICACAO = 0,
  PAGAMENTO = 1,
  REVISAO = 2,
}
