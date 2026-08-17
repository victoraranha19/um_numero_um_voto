'use client';

import Carregando from '@components/carregando';
import { createTheme, ThemeProvider } from '@mui/material';
import { green, red, yellow } from '@mui/material/colors';
import { ReactNode, useEffect, useState } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

const theme = createTheme({
  colorSchemes: {
    dark: {
      palette: {
        primary: red,
        secondary: yellow,
      },
    },
    light: {
      palette: {
        primary: green,
        secondary: yellow,
      },
    },
  },
});

export default function MyThemeProvider({ children }: ThemeProviderProps) {
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setCarregando(false);
    }, 500);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {carregando ? <Carregando /> : children}
    </ThemeProvider>
  );
}
