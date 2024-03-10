import React, { FC, FormEvent, useState } from 'react';


import {getAllBlockchainAccount} from '@api-r/action/blockchain/account';
import {getAllWalletInspectorNetworks} from '@api-r/action/wallet-inspector';
import {  Grid, Box, Button, Typography } from '@mui/material';
import {BlockchainAccountQueryKeys} from '@types/action/blockchain';
import {
  ActionWalletInspectorBuildTransactionsReportRequestData,
  ActionWalletInspectorQueryKeys
} from '@types/action/wallet-inspector';
import {  useQuery } from 'react-query';

import { CustomSelect } from '../../../CustomSelect';
import { MultiSelectComponent } from '../../../MultiSelectComponent';


interface ConfigWalletInspectorFormProps {
  onSubmitHandler: (data: ActionWalletInspectorBuildTransactionsReportRequestData) => void;
}
export const ConfigWalletInspectorForm: FC<ConfigWalletInspectorFormProps> = ({ onSubmitHandler }) => {
  const [formData, setFormData] = useState<ActionWalletInspectorBuildTransactionsReportRequestData>({
    network: '',
    addresses: [],
  });
  const [formErrors, setFormErrors] = useState({
    network: false,
    addresses: false,
  });
  const [errorMsg, setErrorMsg] = useState({
    network: '',
    addresses: '',
  });

  const networksData = useQuery(
    ActionWalletInspectorQueryKeys.Networks,
    () =>
      getAllWalletInspectorNetworks({ onlyActive: true }),
    {
      select: data => data
    },
  );

  const blockchainAccountsData = useQuery(
    BlockchainAccountQueryKeys.blockchainAccountsAll,
    () =>
      getAllBlockchainAccount({
        paginate: { page: 1, count: 100 },
        sort: { name: '_id', type: 'asc' },
      }),
    { 
      select: data => data.data 
    },
  );

  const networks = networksData.data ?
    networksData.data.map(v => ({ value: v, label: v }))
    : [];
  const accounts = blockchainAccountsData.data ?
    blockchainAccountsData.data.map(v => ({ value: v.address, label: `${v.name} - ${v.address}` }))
    : [];
  
  const selectAllAccounts = () => {
    if(accounts.length === 0) return;

    setFormErrors(prevState => ({
      ...prevState,
      addresses: false,
    }));
    setErrorMsg(prevState => ({
      ...prevState,
      addresses: '',
    }));
    setFormData(prevState => ({
      ...prevState,
      addresses: accounts.map(v => v.value)
    }));
  };
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.network.trim().length === 0) {
      setFormErrors(prevState => ({ ...prevState, network: true }));
      setErrorMsg(prevState => ({ ...prevState, network: 'Please fill this field' }));

      return;
    }

    if (formData.addresses.length === 0) {
      setFormErrors(prevState => ({ ...prevState, addresses: true }));
      setErrorMsg(prevState => ({ ...prevState, addresses: 'Please fill this field' }));

      return;
    }
    
    setFormErrors({
      network: false,
      addresses: false,
    });
    setErrorMsg({
      network: '',
      addresses: '',
    });

    onSubmitHandler({ ...formData });
  };
  
  return (
    <Box sx={{ p: 2 }} bgcolor="white">
      <form onSubmit={handleSubmit}>
        <fieldset>
          <Grid container sx={{ p: 3 }}>
            <Grid alignItems="center" container sx={{ mb: 2 }}>
              <Grid item xs={2}>
                <label>Network:</label>
              </Grid>
              <Grid item xs={10}>
                <CustomSelect
                  options={{ data: networks }}
                  fieldName="network"
                  formValue={formData.network}
                  setFormValue={setFormData}
                />
                {formErrors.network && <Typography color="error">{errorMsg.network}</Typography>}
              </Grid>
            </Grid>
            <Grid alignItems="center" container sx={{ mb: 2 }}>
              <Grid item xs={2}>
                <label>Addresses:</label>
              </Grid>
              <Grid item xs={10}>
                <MultiSelectComponent
                  menuItems={accounts}
                  fieldName="addresses"
                  selectedValues={formData.addresses}
                  setSelectedValues={setFormData}
                />
                {formErrors.addresses && <Typography color="error">{errorMsg.addresses}</Typography>}
              </Grid>
            </Grid>
          </Grid>

          <Box textAlign="right" sx={{ p: 3 }}>
            <Button sx={{ mr: 2 }} size="large" variant="contained" color={'secondary'} onClick={selectAllAccounts}>
              Select all accounts
            </Button>
            <Button type="submit" sx={{ mr: 2 }} size="large" variant="contained" color={'primary'}>
              Apply
            </Button>
          </Box>
        </fieldset>
      </form>
    </Box>
  );
};
