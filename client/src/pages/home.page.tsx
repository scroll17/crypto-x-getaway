import React, { useState } from 'react';

import { TabContext, TabList } from '@mui/lab';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Tab } from '@mui/material';

import { Accounts } from '../components/Accounts';
import { Browsers } from '../components/Browsers';
import { Strategies } from '../components/Strategies';
import { UsersTable } from '../components/UsersTable';

export const HomePage = () => {
  const [value, setValue] = useState('0');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Box
      sx={{
        backgroundColor: '#f1f1f1',
      }}
    >
      <TabContext value={value}>
        <TabList onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Users" value="0" />

          <Tab label="Accounts" value="1" />
          <Tab label="Browsers" value="2" />
          <Tab label="Strategies" value="3" />
        </TabList>
        <TabPanel value="0">
          <UsersTable />
        </TabPanel>
        <TabPanel value="1">
          <Accounts />
        </TabPanel>
        <TabPanel value="2">
          <Browsers />
        </TabPanel>
        <TabPanel value="3">
          <Strategies />
        </TabPanel>
      </TabContext>
    </Box>
  );
};
