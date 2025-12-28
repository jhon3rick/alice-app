import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import './Splash.scss';

const Splash: React.FC = () => {
  return (
    <Container maxWidth="lg" className="splash">
      <Box className="splash__container">
        <Typography variant="h2" component="h1" className="splash__title">
          Alice App
        </Typography>
        <Typography variant="h5" color="text.secondary" className="splash__subtitle">
          Command Template Manager
        </Typography>
      </Box>
    </Container>
  );
};

export default Splash;
