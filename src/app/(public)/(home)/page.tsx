'use client';

import { PRESIDENTE } from '@lib/constants';
import { EPresidente } from '@lib/enums';
import styles from './home.module.css';
import { useEffect, useState } from 'react';
import { ultimos20Recibos } from '@app/api/recibo/actions';
import { IVotoConfirmado } from '@lib/types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Typography,
  useColorScheme,
} from '@mui/material';
import { ArrowDownwardRounded, ArrowUpwardRounded } from '@mui/icons-material';
import { useSearchParams } from 'next/navigation';
import { getDataBrasil, getNomeEscondido } from '@lib/utils';

export default function HomePage() {
  const [ultimosVotos, setUltimosVotos] = useState<IVotoConfirmado[]>([]);
  const [votosBolsonaro, setVotosBolsonaro] = useState(0);
  const [votosLula, setVotosLula] = useState(0);
  const [votosNulo, setVotosNulo] = useState(0);
  const [votosTotais, setVotosTotais] = useState(0);

  const presidente = useSearchParams().get('p');
  const { setMode } = useColorScheme();

  useEffect(() => {
    if (presidente) {
      setMode(presidente === EPresidente.LULA ? 'dark' : 'light');
    }

    ultimos20Recibos().then((uv) => {
      setUltimosVotos(uv);

      let b = 0;
      let l = 0;
      let n = 0;
      let total = 0;
      uv.forEach((v) => {
        total += v.quantidade;
        switch (v.presidente) {
          case EPresidente.BOLSONARO:
            b += v.quantidade;
            break;
          case EPresidente.LULA:
            l += v.quantidade;
            break;
          default:
            n += v.quantidade;
            break;
        }
      });

      setVotosBolsonaro(b);
      setVotosLula(l);
      setVotosNulo(n);
      setVotosTotais(total);
    });
  }, [presidente, setMode]);

  return (
    <>
      <Card>
        <CardMedia
          component="img"
          image="/bolsonaro-vs-lula.jpg"
          title="Flávio Bolsonaro versus Lula"
        />
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {votosBolsonaro < votosLula ? (
              <Avatar sx={{ bgcolor: 'success.main' }}>
                <ArrowUpwardRounded />
              </Avatar>
            ) : (
              <Avatar sx={{ bgcolor: 'error.main' }}>
                <ArrowDownwardRounded />
              </Avatar>
            )}

            <Typography variant="button" sx={{ fontSize: { xs: 12, sm: 14 } }}>
              Lula <br />
              Votos: {votosLula} ({((100 * votosLula) / votosTotais).toFixed(0)}
              %)
            </Typography>
          </Box>
          <Typography variant="button" sx={{ fontSize: { xs: 12, sm: 14 } }}>
            Nenhum <br />
            Votos: {votosNulo}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {votosLula < votosBolsonaro ? (
              <Avatar sx={{ bgcolor: 'success.main' }}>
                <ArrowUpwardRounded />
              </Avatar>
            ) : (
              <Avatar sx={{ bgcolor: 'error.main' }}>
                <ArrowDownwardRounded />
              </Avatar>
            )}
            <Typography variant="button" sx={{ fontSize: { xs: 12, sm: 14 } }}>
              Flávio Bolsonaro <br />
              Votos: {votosBolsonaro} (
              {((100 * votosBolsonaro) / votosTotais).toFixed(0)}
              %)
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <Divider sx={{ my: 3 }} />
      <div className={styles.container}>
        <ul className={styles.group}>
          {ultimosVotos.map((uv, i) => (
            <li key={uv.nome + i}>
              +{uv.quantidade} voto(s) em {PRESIDENTE[uv.presidente]} -{' '}
              {getNomeEscondido(uv.nome)} (
              {getDataBrasil(new Date(uv.data_pagamento))})
            </li>
          ))}
        </ul>
        <ul className={styles.group} aria-hidden>
          {ultimosVotos.map((uv, i) => (
            <li key={uv.nome + i}>
              +{uv.quantidade} voto(s) em {PRESIDENTE[uv.presidente]} -{' '}
              {getNomeEscondido(uv.nome)} (
              {getDataBrasil(new Date(uv.data_pagamento))})
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
