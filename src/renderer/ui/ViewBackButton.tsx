/**
 * ViewBackButton
 *
 * Button component for navigating back.
 * Uses React Router to go to the previous page.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const ViewBackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <IconButton
      onClick={() => navigate(-1)}
      aria-label="back"
      sx={{
        color: '#005461',
        bgcolor: 'transparent',
        width: 48,
        height: 48,
        '&:hover': {
          bgcolor: 'rgba(0, 84, 97, 0.08)',
        },
        '& svg': {
          fontSize: 28,
        },
      }}
    >
      <ArrowBack />
    </IconButton>
  );
};

export default ViewBackButton;
