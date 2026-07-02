import { Button, ButtonGroup } from '@mui/material';
import { useState } from 'react';

interface CampoNumeroProps {
  min?: number;
  max?: number;
}

export default function CampoNumero({ min = 1, max = 200 }: CampoNumeroProps) {
  const [numero, setNumero] = useState(1);

  function handleChange(value: number) {
    if (value < min) setNumero(min);
    else if (value > max) setNumero(max);
    else setNumero(value);
  }

  return (
    <ButtonGroup variant="outlined">
      <Button onClick={() => handleChange(numero - 100)}>-100</Button>
      <Button onClick={() => handleChange(numero - 10)}>-10</Button>
      <Button onClick={() => handleChange(numero - 1)}>-1</Button>
      <Button>{numero}</Button>
      <Button onClick={() => handleChange(numero + 1)}>+1</Button>
      <Button onClick={() => handleChange(numero + 10)}>+10</Button>
      <Button onClick={() => handleChange(numero + 100)}>+100</Button>
    </ButtonGroup>
  );
}
