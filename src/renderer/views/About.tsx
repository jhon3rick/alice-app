/**
 * About
 *
 * About page displaying project information and links.
 * Provides overview of Alice App and GitHub repository link.
 */

import React from 'react';
import {
  Typography,
  Box,
  Link,
  Paper,
} from '@mui/material';
import { GitHub } from '@mui/icons-material';

// Custom components
import ViewContainer from '@ui/ViewContainer';

import './About.scss';

const About: React.FC = () => {
  const handleGitHubClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.electron.openExternal('https://github.com/jhon3rick/alice-app');
  };

  return (
    <ViewContainer title="About">
      <Paper className="about__paper">
        <Typography variant="h4" gutterBottom align="center">
          Alice App
        </Typography>

        <Typography variant="h6" color="text.secondary" gutterBottom align="center">
          Command Template Manager
        </Typography>

        <Box className="about__content">
          <Typography variant="body1" paragraph>
            Alice App is a powerful desktop application designed to help developers and system administrators manage and execute command templates efficiently. Built with Electron and React, it provides a user-friendly interface for organizing commands, projects, and tags.
          </Typography>

          <Typography variant="body1" paragraph>
            Key features include:
          </Typography>

          <Box component="ul" className="about__features">
            <Typography component="li" variant="body1">
              Command template management with customizable parameters
            </Typography>
            <Typography component="li" variant="body1">
              Project-based organization for better workflow
            </Typography>
            <Typography component="li" variant="body1">
              Tagging system for easy command categorization
            </Typography>
            <Typography component="li" variant="body1">
              JSON import/export for data portability
            </Typography>
            <Typography component="li" variant="body1">
              Terminal execution with real-time output
            </Typography>
          </Box>

          <Typography variant="body1" paragraph>
            Whether you're a developer scripting repetitive tasks or a sysadmin managing complex command sequences, Alice App streamlines your workflow with an intuitive interface and robust functionality.
          </Typography>
        </Box>

        <Box className="about__link-container">
          <Link
            href="https://github.com/jhon3rick/alice-app"
            onClick={handleGitHubClick}
            className="about__link"
          >
            <GitHub />
            View on GitHub
          </Link>
        </Box>
      </Paper>
    </ViewContainer>
  );
};

export default About;