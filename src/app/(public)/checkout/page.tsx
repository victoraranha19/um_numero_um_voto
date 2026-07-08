'use client';

import { getURLPagamento } from '@/_api/actions';
import { auth } from '@/_api/auth';
import DadosForm from '@/_components/dados-form';
import Pagamento from '@/_components/pagamento';
import { Button, Step, StepLabel, Stepper } from '@mui/material';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const [passo, setPasso] = useState<EPasso>(EPasso.IDENTIFICACAO);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, [user]);

  function irParaProximoPasso(p: EPasso) {
    if (p > EPasso.REVISAO) return;
    setPasso(p);
  }

  async function irParaPagamento(p: EPasso) {
    irParaProximoPasso((p + 1) as EPasso);
    // await getURLPagamento()
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
      {passo === EPasso.IDENTIFICACAO && user && user.email && (
        <DadosForm
          email={user.email}
          irParaProximoPasso={() => irParaPagamento(passo)}
        />
      )}
      {passo === EPasso.PAGAMENTO && <Pagamento url="" />}
      {passo === EPasso.REVISAO && <>Passo3</>}

      {passo > EPasso.IDENTIFICACAO && (
        <Button variant="contained" onClick={() => irParaProximoPasso(passo)}>
          {passo === EPasso.REVISAO ? 'Completar' : 'Avançar'}
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
