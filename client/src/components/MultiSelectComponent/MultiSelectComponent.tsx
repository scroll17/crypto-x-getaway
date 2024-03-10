import React, { FC, Dispatch, useState } from 'react';

import {Select, MenuItem, SelectChangeEvent, TextField, Chip, Button, Box, Container} from '@mui/material';

interface MultiSelectComponentProps {
  menuItems: Array<{ value: string; label: string; }>;
  fieldName: string;
  selectedValues: string[];
  setSelectedValues: Dispatch<React.SetStateAction<Record<string, unknown>>>;
}

export const MultiSelectComponent: FC<MultiSelectComponentProps> = ({
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
    <Container style={{ padding: 0 }}>
      <Box display="flex" alignItems="center" sx={{ margin: '0 0 20px 0' }} columnGap={2}>
        <Select
          variant="outlined"
          size="small"
          multiple
          sx={{
            minWidth: '166px',
            '> div:first-child': {
              whiteSpace: 'pre-wrap',
              overflow: 'visible',
            }
          }}
          name={fieldName}
          value={selectedValues}
          onChange={handleSelectChange}
          renderValue={selected =>
            selected.map(value => (
              <Chip sx={{ height: 'auto' }} key={value} label={value} style={{ margin: 2 }} />
            ))
          }
        >
          {
            menuItems.length > 0
              ? menuItems.map(item => (
                <MenuItem key={item.label} value={item.value}>
                  {item.label}
                </MenuItem>
              ))
              : []
          }
        </Select>
      </Box>
      <Box display="flex" alignItems="center" columnGap={2}>
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
    </Container>
  );
};
