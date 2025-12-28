import React from 'react';
import {
  Terminal as TerminalIcon,
  Folder as FolderIcon,
  Label as LabelIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

export interface HomeModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactElement;
  path: string;
  color: string;
}

export const homeModules: HomeModule[] = [
  {
    id: 'card-command',
    title: 'Commands',
    description: 'Manage and execute command templates',
    icon: <TerminalIcon sx={{ fontSize: 60 }} />,
    path: '/commands',
    color: '#018790',
  },
  {
    id: 'card-projects',
    title: 'Projects',
    description: 'Manage your projects and paths',
    icon: <FolderIcon sx={{ fontSize: 60 }} />,
    path: '/projects',
    color: '#018790',
  },
  {
    id: 'card-tags',
    title: 'Tags',
    description: 'Organize commands with tags',
    icon: <LabelIcon sx={{ fontSize: 60 }} />,
    path: '/tags',
    color: '#018790',
  },
  {
    id: 'card-config',
    title: 'Config',
    description: 'Configure application settings',
    icon: <SettingsIcon sx={{ fontSize: 60 }} />,
    path: '/config',
    color: '#005461',
  },
];
