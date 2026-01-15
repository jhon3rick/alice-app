/**
 * Splash
 *
 * Splash screen component.
 * Displays a loading screen and redirects to specified route after duration.
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Fade } from '@mui/material';
import './Splash.scss';

interface SplashProps {
  duration?: number;
  redirectTo?: string;
}

const Splash: React.FC<SplashProps> = ({ duration = 2000, redirectTo = 'home' }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/${redirectTo}`);
    }, duration);

    return () => clearTimeout(timer);
  }, [navigate, duration]);

  return (
    <Fade in={true} timeout={600}>
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
    </Fade>
  );
};

export default Splash;
