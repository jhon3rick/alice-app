/**
 * VariableHelpButton
 *
 * Independent component that displays a help icon button
 * and shows a modal with variable details when clicked
 */

import React, { useState } from 'react';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface VariableHelpButtonProps {
  variableName: string;
  variableDetail: string;
}

const VariableHelpButton: React.FC<VariableHelpButtonProps> = ({
  variableName,
  variableDetail,
}) => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleOpenModal}
        className="command-variables-form__help-button"
      >
        <HelpOutlineIcon fontSize="small" />
      </IconButton>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{variableName}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {variableDetail}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VariableHelpButton;
