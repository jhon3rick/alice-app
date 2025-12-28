import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, IconButton, Typography, Container } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

interface ViewContainerProps {
  title: string;
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  showBackButton?: boolean;
  actions?: ReactNode;
}

const ViewContainer: React.FC<ViewContainerProps> = ({
  title,
  children,
  maxWidth = 'lg',
  showBackButton = true,
  actions,
}) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          {showBackButton && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => navigate(-1)}
              sx={{ mr: 2 }}
              aria-label="back"
            >
              <ArrowBack />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {actions && <Box sx={{ display: 'flex', gap: 1 }}>{actions}</Box>}
        </Toolbar>
      </AppBar>

      <Container maxWidth={maxWidth} sx={{ flex: 1, py: 4, overflow: 'auto' }}>
        {children}
      </Container>
    </Box>
  );
};

export default ViewContainer;
