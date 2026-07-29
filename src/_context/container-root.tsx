import { Card, CardContent, Container } from '@mui/material';
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
      <Card sx={{ minWidth: 400, maxWidth: 700 }}>
        <CardContent sx={{ minHeight: 600 }}>{children}</CardContent>
      </Card>
    </Container>
  );
}
