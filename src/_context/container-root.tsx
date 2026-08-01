'use client';

import Rodape from '@components/rodape';
import { Card, CardContent, Container, Divider } from '@mui/material';
import { ReactNode } from 'react';

interface ContainerRootProps {
  children: ReactNode;
}

export default function ContainerRoot({ children }: ContainerRootProps) {
  return (
    <Container
      disableGutters
      sx={{ display: 'flex', justifyContent: 'center' }}
    >
      <Card
        sx={{
          minWidth: 400,
          maxWidth: 700,
          minHeight: 800,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>{children}</CardContent>
        <Divider />
        <CardContent>
          <Rodape />
        </CardContent>
      </Card>
    </Container>
  );
}
