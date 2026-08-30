'use client';

import { PRESIDENTE } from '@lib/constants';
import { EPresidente } from '@lib/enums';
import { IVotoConfirmado } from '@lib/types';
import { getDataBrasil, getNomeEscondido } from '@lib/utils';
import { ArrowDownwardRounded, ArrowUpwardRounded } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Typography,
  useColorScheme,
} from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import styles from './home.module.css';
import { getTotalPresidente, ultimas20Compras } from '@app/api/pedido/actions';

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

    ultimas20Compras().then((uv) => setUltimosVotos(uv));

    getTotalPresidente().then((tp) => {
      let total = 0;
      tp.forEach((v) => {
        total += v.total;
        switch (v.presidente) {
          case EPresidente.BOLSONARO:
            setVotosBolsonaro(v.total);
            break;
          case EPresidente.LULA:
            setVotosLula(v.total);
            break;
          default:
            setVotosNulo(v.total);
            break;
        }
      });
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
      <Button fullWidth href="/rifa" variant="outlined" size="large">
        Quero votar
      </Button>
      <Divider sx={{ my: 3 }} />
      <div className={styles.container}>
        <ul className={styles.group}>
          {ultimosVotos.map((uv, i) => (
            <li key={uv.nome + i}>
              +{uv.quantidade} voto(s) em {PRESIDENTE[uv.presidente]} -{' '}
              {getNomeEscondido(uv.nome)} (
              {getDataBrasil(new Date(uv.data_pago))})
            </li>
          ))}
        </ul>
        <ul className={styles.group} aria-hidden>
          {ultimosVotos.map((uv, i) => (
            <li key={uv.nome + i}>
              +{uv.quantidade} voto(s) em {PRESIDENTE[uv.presidente]} -{' '}
              {getNomeEscondido(uv.nome)} (
              {getDataBrasil(new Date(uv.data_pago))})
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
