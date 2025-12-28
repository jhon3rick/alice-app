import React from 'react';
import { Typography } from '@mui/material';

interface ViewTitleProps {
  title: string;
}

const ViewTitle: React.FC<ViewTitleProps> = ({ title }) => {
  return (
    <Typography variant="h6" sx={{ flexGrow: 1 }}>
      {title}
    </Typography>
  );
};

export default ViewTitle;
