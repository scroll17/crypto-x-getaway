import React, { useState, FC, Dispatch, useMemo } from 'react';

import { Select, MenuItem, TextField, SelectChangeEvent } from '@mui/material';

import { ActionAddBlockchainAccountRequestData } from '../../types/action/blockchain/account';

interface CustomOption {
  value: string;
  label: string;
}

interface CustomSelectWithAddProps {
  options: { data: CustomOption[] | undefined };
  // adding ActionAddBlockchainAccountRequestData is incorrect need to improve
  setFormValue: Dispatch<React.SetStateAction<ActionAddBlockchainAccountRequestData>>;
  fieldName: string;
  formValue: string;
}

export const CustomSelectWithAdd: FC<CustomSelectWithAddProps> = ({
  options,
  setFormValue,
  formValue,
  fieldName,
}) => {
  const [selectedValue, setSelectedValue] = useState('');

  const customOptions: CustomOption[] = useMemo(() => {
    if (options?.data) {
      return options.data;
    } else {
      return [{ value: '', label: '' }];
    }
  }, [options]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    setSelectedValue(value);

    setFormValue(prevState => ({
      ...prevState,
      [fieldName]: value === 'addCustom' ? '' : value,
    }));
  };

  const handleCustomInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormValue(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <Select
        variant="outlined"
        size="small"
        sx={{ minWidth: '166px' }}
        name={fieldName}
        placeholder="Choose"
        value={selectedValue}
        defaultValue={`Choose your ${fieldName}`}
        onChange={handleChange}
        renderValue={value => {
          const selectedOption = customOptions.find(option => option.value === value);
          if (selectedOption) {
            return selectedOption.label;
          }
          return value as string;
        }}
      >
        {customOptions.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
        <MenuItem value="addCustom">Add Custom</MenuItem>
      </Select>
      {selectedValue === 'addCustom' && (
        <TextField
          name={fieldName}
          sx={{ ml: 2 }}
          variant="outlined"
          size="small"
          label="Enter custom value"
          value={formValue}
          onChange={handleCustomInputChange}
        />
      )}
    </>
  );
};
