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
import ActionsToolbar, { IActionButton } from '@ui/ActionsToolbar';

import './ViewContainer.scss';

interface ViewContainerProps {
  title?: string;
  module?: string;
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  showBackButton?: boolean;
  actions?: IActionButton[];
  customActions?: ReactNode;
  className?: string;
}

const ViewContainer: React.FC<ViewContainerProps> = ({ title, children, maxWidth = 'lg', showBackButton = true, actions, customActions, className, ...props }) => {
  let module;
  if (props.module) {
    module = props.module;
  } else if (title) {
    module = title.toLowerCase().replace(/\s+/g, '-');
  }
  const classContainer = module ? `view-container-${module}` : '';
  const classContent = module ? `view-container-${module}__content` : '';
  return (
    <div className={`view-container ${classContainer} ${className || ''}`} {...props}>
      <div className="view-container__header">
        {showBackButton && <ViewBackButton />}
        {title && <ViewTitle title={title} />}
        {(actions || customActions) && (
          <div className="view-container__actions">
            <ActionsToolbar actions={actions} customActions={customActions} />
          </div>
        )}
      </div>

      {/* Contenido */}
      <Container maxWidth={maxWidth} className={`view-container__content ${classContent}`}>
        {children}
      </Container>
    </div>
  );
};

export default ViewContainer;
