import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
} from '@mui/material';
import {
  Terminal as TerminalIcon,
  Folder as FolderIcon,
  Label as LabelIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import './Home.scss';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const cards = [
    {
      id: 'card-command',
      title: 'Commands',
      description: 'Manage and execute command templates',
      icon: <TerminalIcon sx={{ fontSize: 60 }} />,
      path: '/commands',
      color: '#005461',
    },
    {
      id: 'card-projects',
      title: 'Projects',
      description: 'Manage your projects and paths',
      icon: <FolderIcon sx={{ fontSize: 60 }} />,
      path: '/projects',
      color: '#018790',
    },
    {
      id: 'card-tags',
      title: 'Tags',
      description: 'Organize commands with tags',
      icon: <LabelIcon sx={{ fontSize: 60 }} />,
      path: '/tags',
      color: '#00B7B5',
    },
    {
      id: 'card-config',
      title: 'Config',
      description: 'Configure application settings',
      icon: <SettingsIcon sx={{ fontSize: 60 }} />,
      path: '/config',
      color: '#018790',
    },
  ];

  return (
    <Container maxWidth="lg" className="home">
      <Box className="home__container">
        <Typography variant="h3" component="h1" className="home__title">
          Alice App
        </Typography>
        <Typography variant="h6" color="text.secondary" className="home__subtitle">
          Command Template Manager
        </Typography>
        <div className="home__cards-grid">
          {cards.map((card) => (
            <Card key={card.id} className="card">
              <CardActionArea onClick={() => navigate(card.path)} className="card__action">
                <CardContent className="card__content">
                  <Box className="card__icon" sx={{ color: card.color }}>
                    {card.icon}
                  </Box>
                  <Typography variant="h5" component="h2" className="card__title">
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </div>
      </Box>
    </Container>
  );
};

export default Home;
