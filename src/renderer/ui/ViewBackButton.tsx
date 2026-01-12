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

// Custom Components
import { styleActionButton } from '@ui/ActionButton';

const ViewBackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <IconButton
      onClick={() => navigate(-1)}
      aria-label="back"
      sx={styleActionButton}
    >
      <ArrowBack />
    </IconButton>
  );
};

export default ViewBackButton;
