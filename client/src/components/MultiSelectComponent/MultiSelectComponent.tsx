import React, { FC, Dispatch, useState } from 'react';

import { Select, MenuItem, SelectChangeEvent, TextField, Chip, Button, Box } from '@mui/material';
import { ActionAddBlockchainAccountRequestData } from '@types/action/blockchain/account';

interface MultySelectComponentProps {
  menuItems: string[];
  fieldName: string;
  selectedValues: string[];
  setSelectedValues: Dispatch<React.SetStateAction<ActionAddBlockchainAccountRequestData>>;
}

export const MultiSelectComponent: FC<MultySelectComponentProps> = ({
  menuItems,
  selectedValues = [],
  setSelectedValues,
  fieldName,
}) => {
  const [customValue, setCustomValue] = useState('');

  const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;

    setSelectedValues(prevState => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomValue(event.target.value);
  };

  const handleAddCustomValue = () => {
    if (customValue.trim() !== '') {
      setSelectedValues(prevState => ({
        ...prevState,
        [fieldName]: [...selectedValues, customValue],
      }));
      setCustomValue('');
    }
  };

  const handleClear = () => {
    setSelectedValues(prevState => ({
      ...prevState,
      [fieldName]: [],
    }));
  };

  return (
    <Box display="flex" alignItems="center" columnGap={2}>
      <Select
        variant="outlined"
        size="small"
        multiple
        sx={{ minWidth: '166px' }}
        name={fieldName}
        value={selectedValues}
        onChange={handleSelectChange}
        renderValue={selected =>
          selected.map(value => (
            <Chip sx={{ height: 'auto' }} key={value} label={value} style={{ margin: 2 }} />
          ))
        }
      >
        {menuItems &&
          menuItems.map(value => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
      </Select>
      <TextField
        variant="outlined"
        size="small"
        name={fieldName}
        label="Add Custom Value"
        value={customValue}
        onChange={handleInputChange}
        onBlur={handleAddCustomValue}
      />
      <Button variant="contained" onClick={handleAddCustomValue}>
        Add
      </Button>
      <Button variant="contained" onClick={handleClear}>
        Clear
      </Button>
    </Box>
  );
};
