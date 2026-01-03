/**
 * ViewContainer
 *
 * Container component for application views.
 * Provides header with back button, title, and actions, plus content area.
 */

import React, { ReactNode } from 'react';
import { Container } from '@mui/material';

// UI
import ViewTitle from '@ui/ViewTitle';
import ViewBackButton from '@ui/ViewBackButton';

import './ViewContainer.scss';

interface ViewContainerProps {
  title?: string;
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  showBackButton?: boolean;
  actions?: ReactNode;
}

const ViewContainer: React.FC<ViewContainerProps> = ({
  title,
  children,
  maxWidth = 'lg',
  showBackButton = true,
  actions,
}) => {

  return (
    <div className="view-container">
      <div className="view-container__header">
        {showBackButton && <ViewBackButton />}
        {title && <ViewTitle title={title} />}
        {actions && (
          <div className="view-container__actions">
            {actions}
          </div>
        )}
      </div>

      {/* Contenido */}
      <Container maxWidth={maxWidth} className="view-container__content">
        {children}
      </Container>
    </div>
  );
};

export default ViewContainer;
