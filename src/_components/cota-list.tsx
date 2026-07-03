import { Cota } from '@lib/types';

interface CotasProps {
  cotas: Cota[];
}

export default function CotaList({ cotas }: CotasProps) {
  return (
    <ul>
      {cotas.map((cota) => (
        <li key={cota.id}>
          {cota.id} - {cota.presidente} - {cota.id_usuario}
        </li>
      ))}
    </ul>
  );
}
