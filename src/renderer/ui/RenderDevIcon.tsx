/**
 * RenderDevIcon
 *
 * Component for rendering technology icons from Simple Icons library.
 * Takes an icon name and displays the corresponding icon.
 */

import React from 'react';
import { Box } from '@mui/material';
import { getIconComponent } from '@const/available_dev_icons';

interface RenderDevIconProps {
  iconName: string;
  size?: number;
}

const RenderDevIcon: React.FC<RenderDevIconProps> = ({ iconName, size = 20 }) => {
  const IconComponent = getIconComponent(iconName);

  if (!IconComponent) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <IconComponent size={size} />
    </Box>
  );
};

export default RenderDevIcon;
