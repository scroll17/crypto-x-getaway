import React, { FC, ReactNode, SyntheticEvent } from 'react';

import { Box, Tab, Tabs } from '@mui/material';

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

interface CustomTabsProps {
  value: number;
  onChangeTab: (event: SyntheticEvent, newValue: number) => void;
  tabLabels: string[];
  tabs: { index: number; renderContent: () => ReactNode }[];
}

export const CustomTabs: FC<CustomTabsProps> = ({ value, tabLabels, tabs, onChangeTab }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#f1f1f1',
      }}
    >
      <Tabs value={value} onChange={onChangeTab}>
        {tabLabels.map((label, index) => (
          <Tab label={label} key={label + index} />
        ))}
      </Tabs>
      {tabs.map(tabElement => (
        <TabPanel value={value} index={tabElement.index} key={tabElement.index}>
          {tabElement.renderContent()}
        </TabPanel>
      ))}
    </Box>
  );
};
