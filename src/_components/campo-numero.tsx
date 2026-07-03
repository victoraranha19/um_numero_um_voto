import { Box, Button, ButtonGroup } from '@mui/material';

interface CampoNumeroProps {
  min?: number;
  max?: number;
  numero: number;
  setNumero: (value: number) => void;
}

export default function CampoNumero({
  min = 1,
  max = 200,
  numero,
  setNumero,
}: CampoNumeroProps) {
  function handleChange(value: number) {
    if (value < min) setNumero(min);
    else if (value > max) setNumero(max);
    else setNumero(value);
  }

  return (
    <Box className="campo-numero">
      <ButtonGroup variant="outlined" orientation="vertical">
        <Button onClick={() => handleChange(numero - 1)}>-1</Button>
        <Button onClick={() => handleChange(numero - 10)}>-10</Button>
        <Button onClick={() => handleChange(numero - 100)}>-100</Button>
      </ButtonGroup>
      <Button>{numero}</Button>
      <ButtonGroup variant="outlined" orientation="vertical">
        <Button onClick={() => handleChange(numero + 1)}>+1</Button>
        <Button onClick={() => handleChange(numero + 10)}>+10</Button>
        <Button onClick={() => handleChange(numero + 100)}>+100</Button>
      </ButtonGroup>
    </Box>
  );
}
