import React, { FC, Dispatch, useMemo } from 'react';

import { Select, MenuItem, SelectChangeEvent } from '@mui/material';

import { ActionAddBlockchainAccountRequestData } from '../../types/action/blockchain/account';

interface CustomOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: { data: CustomOption[] | undefined };
  // adding ActionAddBlockchainAccountRequestData is incorrect need to improve
  setFormValue: Dispatch<React.SetStateAction<ActionAddBlockchainAccountRequestData>>;
  fieldName: string;
  formValue: string;
}

export const CustomSelect: FC<CustomSelectProps> = ({
  options,
  setFormValue,
  fieldName,
  formValue,
}) => {
  const customOptions: CustomOption[] = useMemo(() => {
    if (options?.data) {
      return options.data;
    } else {
      return [{ value: '', label: '' }];
    }
  }, [options]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;

    setFormValue(prevState => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  return (
    <>
      <Select
        variant="outlined"
        size="small"
        sx={{ minWidth: '166px' }}
        name={fieldName}
        value={formValue}
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
      </Select>
    </>
  );
};
