import React, { ReactNode } from 'react';
import { Box, AppBar, Toolbar, Container } from '@mui/material';

// UI
import ViewTitle from "@ui/ViewTitle";
import BackButton from "@ui/BackButton";

interface ViewContainerProps {
  title?: string;
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

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          {showBackButton && <BackButton />}
          {title && <ViewTitle title={title}/>}
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
