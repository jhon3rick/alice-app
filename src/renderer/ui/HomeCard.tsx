/**
 * HomeCard
 *
 * Navigation card component for home view.
 * Displays module information with icon and navigates on click.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
} from '@mui/material';

import './HomeCard.scss';

interface HomeCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactElement;
  path: string;
  color: string;
}

const HomeCard: React.FC<HomeCardProps> = ({ title, description, icon, path, color }) => {
  const navigate = useNavigate();

  return (
    <Card className="home-card">
      <CardActionArea onClick={() => navigate(path)} className="home-card__action">
        <CardContent className="home-card__content">
          <Box className="home-card__icon" sx={{ color }}>
            {icon}
          </Box>
          <Typography variant="h5" component="h2" className="home-card__title">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default HomeCard;