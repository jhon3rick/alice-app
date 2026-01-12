/**
 * ActionButton
 *
 * Material UI icon button with tooltip.
 * Features transparent background, rounded border, and customizable color.
 * Styles defined in SCSS with theme variables.
 */

import React from 'react';
import { IconButton, Tooltip, SxProps, Theme } from '@mui/material';
import { Info as InfoIcon, Add as AddIcon, Help as HelpIcon } from '@mui/icons-material';

type IconName = 'add' | 'info' | 'help';

export interface IActionButton {
  size?: 'small' | 'medium' | 'large';
  iconName: IconName;
  tooltip?: string;
  onClick?: () => void;
  className?: string;
}

const iconByType: Record<IconName, React.ReactElement> = {
  add: <AddIcon />,
  info: <InfoIcon />,
  help: <HelpIcon />,
};

export const styleActionButton: SxProps<Theme> = {
  color: 'primary.main',
  bgcolor: 'transparent',
  width: 48,
  height: 48,
  '&:hover': {
    bgcolor: 'action.hover',
  },
  '&:active': {
    bgcolor: 'action.selected',
  },
  '& svg': {
    fontSize: 28,
  },
}

const ActionButton: React.FC<IActionButton> = ({ iconName, tooltip, onClick, className = '', size = 'medium' }) => {
  if (!iconByType[iconName]) {
    return (console.warn(`ActionButton: Unsupported icon name "${iconName}" by ActionButton component.`), null);
  }

  const button = (
    <IconButton
      size={size}
      onClick={onClick}
      aria-label={tooltip}
      className={className}
      sx={styleActionButton}
    >
      {iconByType[iconName]}
    </IconButton>
  );

  if (!tooltip) {
    return button;
  }
  return (
    <Tooltip title={tooltip} arrow placement="bottom">
      {button}
    </Tooltip>
  );
};

export default ActionButton;
