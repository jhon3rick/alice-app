import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <IconButton
      edge="start"
      color="inherit"
      onClick={() => navigate(-1)}
      sx={{ mr: 2 }}
      aria-label="back"
    >
      <ArrowBack />
    </IconButton>
  );
};

export default BackButton;
