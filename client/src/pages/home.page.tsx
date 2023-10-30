import React, { useState } from 'react';

import { TabContext, TabList } from '@mui/lab';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Tab } from '@mui/material';

import { Accounts } from '../components/Accounts';
import { Browsers } from '../components/Browsers';
import { Strategies } from '../components/Strategies';

export const HomePage = () => {
  const [value, setValue] = useState('0');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Box
      sx={{
        backgroundColor: '#ece9e9',
      }}
    >
      <TabContext value={value}>
        <TabList onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Accounts" value="0" />
          <Tab label="Browsers" value="1" />
          <Tab label="Strategies" value="2" />
        </TabList>

        <TabPanel value="0">
          <Accounts />
        </TabPanel>
        <TabPanel value="1">
          <Browsers />
        </TabPanel>
        <TabPanel value="2">
          <Strategies />
        </TabPanel>
      </TabContext>
    </Box>
  );
};
