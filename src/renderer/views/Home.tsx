/**
 * Home
 *
 * Main home view component.
 * Displays navigation cards for different application sections.
 */

import React from 'react';
import {
  Box,
  Container,
  Typography,
} from '@mui/material';
import { homeModules } from '@utils/homeModules';

// Custom Components
import HomeCard from '@ui/HomeCard';

import './Home.scss';

const Home: React.FC = () => {
  return (
    <Container maxWidth="lg" className="home">
      <Box className="home__container">
        <Box className="home__header">
          <Typography variant="h3" component="h1" className="home__title">
            Alice App
          </Typography>
          <Typography variant="h6" color="text.secondary" className="home__subtitle">
            Command Template Manager
          </Typography>
        </Box>
        <div className="home__cards-grid">
          {homeModules.map((module) => <HomeCard key={module.id} {...module} />)}
        </div>
      </Box>
    </Container>
  );
};

export default Home;
