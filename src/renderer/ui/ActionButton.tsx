/**
 * ActionButton
 *
 * Material UI icon button with tooltip.
 * Features transparent background, rounded border, and customizable color.
 * Styles defined in SCSS with theme variables.
 */

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Info as InfoIcon, Add as AddIcon, Help as HelpIcon } from '@mui/icons-material';

import './ActionButton.scss';

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

const ActionButton: React.FC<IActionButton> = ({ iconName, tooltip, onClick, className = '', size = 'medium' }) => {
  if (!iconByType[iconName]) {
    return console.warn(`ActionButton: Unsupported icon name "${iconName}" by ActionButton component.`), null;
  }

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
