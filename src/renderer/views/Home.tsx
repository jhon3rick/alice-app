/**
 * Home
 *
 * Main home view component.
 * Displays navigation cards for different application sections.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import { homeModules } from '@utils/homeModules';

// Custom Components
import HomeCard from '@ui/HomeCard';
import ActionsToolbar, { IActionButton } from '@ui/ActionsToolbar';

import './Home.scss';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const headerActions: IActionButton[] = [
    {
      iconName: 'info',
      tooltip: 'About',
      onClick: () => navigate('/about'),
    },
  ];

  return (
    <Container maxWidth="lg" className="home">
      <Box className="home__container">
        <ActionsToolbar actions={headerActions} />
        <Box className="home__header">
          <Box>
            <Typography variant="h3" component="h1" className="home__title">
              Alice App
            </Typography>
            <Typography variant="h6" color="text.secondary" className="home__subtitle">
              Command Template Manager
            </Typography>
          </Box>
        </Box>
        <div className="home__cards-grid">
          {homeModules.map((module) => (
            <HomeCard key={module.id} {...module} />
          ))}
        </div>
      </Box>
    </Container>
  );
};

export default Home;
