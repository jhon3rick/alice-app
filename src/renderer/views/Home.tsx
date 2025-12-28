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
import { homeModules } from '@utils/homeModules';
import './Home.scss';

const Home: React.FC = () => {
  const navigate = useNavigate();

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
          {homeModules.map((module) => (
            <Card key={module.id} className="card">
              <CardActionArea onClick={() => navigate(module.path)} className="card__action">
                <CardContent className="card__content">
                  <Box className="card__icon" sx={{ color: module.color }}>
                    {module.icon}
                  </Box>
                  <Typography variant="h5" component="h2" className="card__title">
                    {module.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {module.description}
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
