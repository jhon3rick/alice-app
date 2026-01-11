/**
 * CmdTemplatesRowDetails
 *
 * Component for displaying the expanded details of a command,
 * including description and list of command steps.
 */

import React from 'react';
import { Typography } from '@mui/material';
import type { CommandTemplate } from '@tstypes/dbmodules';

import './CmdTemplatesRowDetails.scss';

interface CmdTemplatesRowDetailsProps {
  command: CommandTemplate;
}

const CmdTemplatesRowDetails: React.FC<CmdTemplatesRowDetailsProps> = ({ command }) => {
  return (
    <div className="command-row-detail">
      {command.detail && (
        <>
          <Typography variant="subtitle2" className="command-row-detail__section-title">
            Detail:
          </Typography>
          <Typography variant="body2" className="command-row-detail__detail-text">
            {command.detail}
          </Typography>
        </>
      )}

      <Typography variant="subtitle2" className="command-row-detail__section-title">
        CommandTemplates:
      </Typography>
      {command.steps && command.steps.length > 0 ? (
        <div className="command-row-detail__steps-container">
          {command.steps.map((step, index) => (
            <div key={index} className="command-row-detail__step-box">
              <Typography variant="caption" className="command-row-detail__step-name">
                {step.name}
              </Typography>
              <code className="command-row-detail__step-command">{step.command}</code>
            </div>
          ))}
        </div>
      ) : (
        <Typography variant="body2" className="command-row-detail__no-commands">
          No commands available.
        </Typography>
      )}
    </div>
  );
};

export default CmdTemplatesRowDetails;
