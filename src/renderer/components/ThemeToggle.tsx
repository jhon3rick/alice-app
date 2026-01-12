/**
 * ThemeToggle
 *
 * Button component for toggling between light, dark, and system (auto) theme modes.
 * Follows the ActionButton/ActionsToolbar UI format with icon-only display.
 */

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  SettingsBrightness as AutoModeIcon
} from '@mui/icons-material';

// Constants
import { styleActionButton } from '@ui/ActionButton';

import './ThemeToggle.scss';

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface IThemeToggle {
  currentTheme?: ThemeMode;
  onThemeChange?: (theme: ThemeMode) => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const themeConfig: Record<ThemeMode, { icon: React.ReactElement; tooltip: string; next: ThemeMode }> = {
  light: {
    icon: <LightModeIcon />,
    tooltip: 'Light mode',
    next: 'dark',
  },
  dark: {
    icon: <DarkModeIcon />,
    tooltip: 'Dark mode',
    next: 'auto',
  },
  auto: {
    icon: <AutoModeIcon />,
    tooltip: 'System mode',
    next: 'light',
  },
};

const ThemeToggle: React.FC<IThemeToggle> = ({
  currentTheme = 'light',
  onThemeChange,
  size = 'medium',
  className = ''
}) => {
  const handleClick = () => {
    const nextTheme = themeConfig[currentTheme].next;
    onThemeChange?.(nextTheme);
  };

  const config = themeConfig[currentTheme];

  return (
    <Tooltip title={config.tooltip} arrow placement="bottom">
      <IconButton
        size={size}
        onClick={handleClick}
        className={`theme-toggle action-buttons ${className}`}
        aria-label={config.tooltip}
        sx={styleActionButton}
      >
        {config.icon}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
