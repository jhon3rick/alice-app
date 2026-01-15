import React, { ReactNode } from 'react';
import ActionButton, { IActionButton } from './ActionButton';

import './ActionsToolbar.scss';

export interface IActionsToolbar {
  actions: IActionButton[];
  customActions?: ReactNode;
}

const ActionsToolbar: React.FC<IActionsToolbar> = ({ actions = [], customActions }) => {
  if (actions.length === 0 && !customActions) { return null; }
  return (
    <div className="actions-toolbar">
      {customActions}
      {actions.map((action, index) => (
        <ActionButton key={index} {...action} />
      ))}
    </div>
  );
};

export { IActionButton };
export default ActionsToolbar;
