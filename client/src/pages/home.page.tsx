import React, { useState, useEffect, FC, ReactNode } from 'react';

import { Box, Tab, Tabs } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import { AccountsTab } from '../components/HomePageTabs/AccountsTab';
import { NetworksTab } from '../components/HomePageTabs/NetworksTab';
import { UsersTab } from '../components/HomePageTabs/UsersTab';
import { WalletInspectorTab } from '../components/HomePageTabs/WalletInspectorTab';

interface TabPanelProps {
  children?: ReactNode;
  value: number;
  index: number;
}

const TabPanel: FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div hidden={value !== index} id={`tabpanel-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export const HomePage = () => {
  const location = useLocation();
  const history = useNavigate();
  const [value, setValue] = useState(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = parseInt(searchParams.get('tab') as string, 10);
    return isNaN(tab) ? 0 : tab;
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', value.toString());

    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [value, location.search, location.pathname]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    history(`?tab=${newValue}`);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f1f1f1',
      }}
    >
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Users" />
        <Tab label="Networks" />
        <Tab label="Accounts" />
        <Tab label="Strategies" />
        <Tab label="Wallet Inspector" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <UsersTab />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <NetworksTab />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <AccountsTab />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <WalletInspectorTab />
      </TabPanel>
    </Box>
  );
};
