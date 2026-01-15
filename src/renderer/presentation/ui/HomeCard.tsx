/**
 * HomeCard
 *
 * Navigation card component for home view.
 * Displays module information with icon and navigates on click.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, CardActionArea, Typography } from '@mui/material';

import './HomeCard.scss';

interface HomeCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactElement;
  path: string;
  color: string;
  readonly?: boolean;
}

const HomeCard: React.FC<HomeCardProps> = ({ title, description, icon, path, color, readonly = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!readonly) {
      navigate(path);
    }
  };

  return (
    <Card className={`home-card ${readonly ? 'home-card__disabled' : ''}`}>
      <CardActionArea onClick={handleClick} className="home-card__action" disabled={readonly}>
        <CardContent className="home-card__content">
          <Box className="home-card__icon" sx={{ color: readonly ? 'rgba(1, 135, 144, 0.4)' : color }}>
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
