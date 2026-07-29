'use client';

import { createTheme, ThemeProvider } from '@mui/material';
import { amber, teal } from '@mui/material/colors';
import { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

export default function MyThemeProvider({ children }: ThemeProviderProps) {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: teal,
      secondary: amber,
    },
    components: {
      MuiButton: {
        defaultProps: {
          sx: {
            minWidth: { xs: 64, sm: 80, md: 120 },
          },
        },
      },
    },
  });
  return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>;
}
