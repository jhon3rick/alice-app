/**
 * Home
 *
 * Main home view component.
 * Displays navigation cards for different application sections.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { homeModules } from '@const/homeModules';
import { useTheme } from '../contexts/ThemeContext';

// Custom Components
import HomeCard from '@ui/HomeCard';
import ViewContainer from '@ui/ViewContainer';
import ThemeToggle from '@components/ThemeToggle';
import { IActionButton } from '@ui/ActionsToolbar';

import './Home.scss';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { mode, setMode } = useTheme();

  const headerActions: IActionButton[] = [
    {
      iconName: 'info',
      tooltip: 'About',
      onClick: () => navigate('/about'),
    },
  ];

  return (
    <ViewContainer
      module="home"
      showBackButton={false}
      actions={headerActions}
      customActions={<ThemeToggle currentTheme={mode} onThemeChange={setMode} />}
    >
      <Box className="home__container">
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
    </ViewContainer>
  );
};

export default Home;
