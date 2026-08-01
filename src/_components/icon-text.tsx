'use client';

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { ReactNode } from 'react';

interface IconTextProps {
  icon: ReactNode;
  label: string;
  caption?: string;
  tooltip?: string;
  onClick?: () => void;
}

export default function IconText({
  icon,
  label,
  caption,
  tooltip,
  onClick = () => {},
}: IconTextProps) {
  return (
    <Tooltip title={tooltip}>
      <Card sx={{ borderRadius: 4 }}>
        <CardActionArea onClick={() => onClick()}>
          <CardContent
            sx={{ display: 'flex', gap: 1, alignItems: 'center', p: 1 }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
              }}
            >
              {icon}
            </Box>
            <Stack>
              <Typography variant="h6">{label}</Typography>
              <Typography variant="body2">{caption}</Typography>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    </Tooltip>
  );
}
