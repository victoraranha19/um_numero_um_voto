import { getVotos } from '@lib/actions';

export default async function VotoList() {
  const votos = await getVotos();
  return (
    <ul>
      {votos.map((voto) => (
        <li key={voto.id}>
          {voto.id} - {voto.presidente} - {voto.data_voto.toLocaleString()}
        </li>
      ))}
    </ul>
  );
}
