import React, { FC, Dispatch } from 'react';

import { SelectChangeEvent } from '@mui/material';
import { Select, MenuItem } from '@mui/material';

import { ActionAddBlockchainAccountRequestData } from '../../types/action/blockchain/account';

interface MultySelectComponentProps {
  menuItems: string[];
  fieldName: string;
  selectedValues: string[];
  setSelectedValues: Dispatch<React.SetStateAction<ActionAddBlockchainAccountRequestData>>;
}

export const MultiSelectComponent: FC<MultySelectComponentProps> = ({
  menuItems,
  selectedValues,
  setSelectedValues,
  fieldName,
}) => {
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    setSelectedValues(prevState => ({ ...prevState, [fieldName]: value }));
  };

  return (
    <Select
      variant="outlined"
      size="small"
      sx={{ minWidth: '166px' }}
      name={fieldName}
      multiple
      value={selectedValues}
      onChange={handleChange}
    >
      {menuItems &&
        menuItems.map((menuItem, index) => (
          <MenuItem key={index} value={menuItem}>
            {menuItem}
          </MenuItem>
        ))}
    </Select>
  );
};
