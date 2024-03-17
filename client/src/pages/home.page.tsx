import React, { useState, useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { CustomTabs } from '../components/CustomTabs/CustomTabs';
import { AccountsTab } from '../components/HomePageTabs/AccountsTab';
import { IntegrationsTab } from '../components/HomePageTabs/IntegrationsTab';
import { NetworksTab } from '../components/HomePageTabs/NetworksTab';
import { UsersTab } from '../components/HomePageTabs/UsersTab';
import { WalletInspectorTab } from '../components/HomePageTabs/WalletInspectorTab';


const tabLabels = ['Users', 'Networks', 'Accounts', 'Integrations', 'Wallet Inspector'];

const tabsElements = [
  {
    index: 0,
    renderContent: () => <UsersTab />,
  },
  {
    index: 1,
    renderContent: () => <NetworksTab />,
  },
  {
    index: 2,
    renderContent: () => <AccountsTab />,
  },
  {
    index: 3,
    renderContent: () => <IntegrationsTab />,
  },
  {
    index: 4,
    renderContent: () => <WalletInspectorTab />,
  },
];


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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    history(`?tab=${newValue}`);
  };

  return (
    <CustomTabs
      value={value}
      tabLabels={tabLabels}
      tabs={tabsElements}
      onChangeTab={handleTabChange}
    />
  );
};
