/**
 * ActionButton
 *
 * Material UI icon button with tooltip.
 * Features transparent background, rounded border, and customizable color.
 * Styles defined in SCSS with theme variables.
 */

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';

import './ActionButton.scss';

interface ActionButtonProps {
  icon: React.ReactNode;
  tooltip?: string;
  onClick?: () => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  tooltip,
  onClick,
  className = '',
  size = 'medium',
}) => {

  const button = (
    <IconButton
      size={size}
      onClick={onClick}
      className={`action-buttons ${className}`}
      aria-label={tooltip}
      sx={{
        width: 48,
        height: 48,
        '& svg': {
          fontSize: 28,
        },
      }}
    >
      {icon}
    </IconButton>
  );

  if (!tooltip) { return button; }
  return (
    <Tooltip title={tooltip} arrow placement="bottom">
      {button}
    </Tooltip>
  );
};

export default ActionButton;
