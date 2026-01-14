/**
 * SelectDevIcon
 *
 * Component for selecting technology icons from SVGL library.
 * Uses Autocomplete for a native select-like experience with search/filter.
 */

import React from 'react';
import { Autocomplete, TextField, Box, Typography } from '@mui/material';
import { AVAILABLE_ICONS, getIconComponent } from '@const/available_dev_icons';
import './SelectDevIcon.scss';

interface SelectDevIconProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
}

const SelectDevIcon: React.FC<SelectDevIconProps> = ({ value, onChange, label }) => {
  const selectedOption = AVAILABLE_ICONS.find((icon) => icon.name === value) || null;
  const SelectedIconComponent = selectedOption ? getIconComponent(selectedOption.name) : null;

  return (
    <Box>
      {label && (
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'medium' }}>
          {label}
        </Typography>
      )}
      <Autocomplete
      value={selectedOption}
      onChange={(_event, newValue) => {
        onChange(newValue ? newValue.name : '');
      }}
      options={AVAILABLE_ICONS}
      getOptionLabel={(option) => {
        if (option.variant) {
          return `${option.label} (${option.variant})`;
        }
        return option.label;
      }}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      ListboxProps={{
        style: {
          maxHeight: '250px',
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Select an icon..."
          InputProps={{
            ...params.InputProps,
            startAdornment: SelectedIconComponent && (
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, mr: 0.5 }}>
                <SelectedIconComponent width={20} height={20} />
              </Box>
            ),
          }}
        />
      )}
      renderOption={(props, option) => {
        const IconComponent = getIconComponent(option.name);
        const { key, ...otherProps } = props;
        return (
          <Box
            component="li"
            key={option.name}
            {...otherProps}
            className="select-icon__option"
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
          >
            {IconComponent && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconComponent width={20} height={20} />
              </Box>
            )}
            <span>
              {option.label}
              {option.variant && (
                <span style={{ fontSize: '0.85em', opacity: 0.7, marginLeft: '4px' }}>
                  ({option.variant})
                </span>
              )}
            </span>
          </Box>
        );
      }}
      noOptionsText="No icons found"
      className="select-icon"
    />
    </Box>
  );
};

export default SelectDevIcon;
