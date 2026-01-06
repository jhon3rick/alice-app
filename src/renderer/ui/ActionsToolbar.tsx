import React from 'react';
import ActionButton, { IActionButton } from './ActionButton';

import './ActionsToolbar.scss';

export interface IActionsToolbar {
  actions: IActionButton[];
}

const ActionsToolbar: React.FC<IActionsToolbar> = ({ actions }) => {
  return(
    <div className="actions-toolbar">
      {
        actions.map((action, index) => (
          <ActionButton key={index} {...action} />
        ))
      }
    </div>
);
};

export { IActionButton };
export default ActionsToolbar;
