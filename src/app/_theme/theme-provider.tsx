'use client';

import { createTheme, ThemeProvider } from '@mui/material';
import { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

export default function MyThemeProvider({ children }: ThemeProviderProps) {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>;
}
