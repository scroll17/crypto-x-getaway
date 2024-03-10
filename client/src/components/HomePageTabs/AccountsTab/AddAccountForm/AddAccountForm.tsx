import React, { FC, FormEvent, useState, ChangeEvent, FocusEvent } from 'react';


import { getBlockchainAccountLabels, addBlockchainAccount } from '@api-r/action/blockchain/account';
import { getAllBlockchainNetwork } from '@api-r/action/blockchain/network';
import { TextField, Grid, Box, Button, Typography } from '@mui/material';
import {
  ActionAddBlockchainAccountRequestData,
  BlockchainAccountQueryKeys,
} from '@types/action/blockchain/account';
import {
  ActionBlockchainNetworkAll,
  BlockchainNetworkQueryKeys,
} from '@types/action/blockchain/network';
import { useMutation, useQuery } from 'react-query';

import { CustomSelect } from '../../../CustomSelect';
import { MultiSelectComponent } from '../../../MultiSelectComponent';
import {toast} from "react-toastify";

interface AddAccountFormProps {
  onCloseHandler: (state: boolean) => void;
}
export interface AccountFormProps {
  name: string;
  adress: string;
  network: string;
  labels: string[];
}
export const AddAccountForm: FC<AddAccountFormProps> = ({ onCloseHandler }) => {
  const [formData, setFormData] = useState<ActionAddBlockchainAccountRequestData>({
    name: '',
    address: '',
    network: '',
    labels: [],
  });

  const [formErrors, setFormErrors] = useState({
    name: false,
    address: false,
    network: false,
    labels: false,
  });

  const [errorMsg, setErrorMsg] = useState({
    name: '',
    address: '',
    network: '',
    labels: '',
  });

  const { data: labelsData } = useQuery(
    BlockchainAccountQueryKeys.blockchainAccountLabels,
    getBlockchainAccountLabels,
  );

  const blockchainNetworkData = useQuery(
    BlockchainNetworkQueryKeys.blockchainNetworkAll,
    () =>
      getAllBlockchainNetwork({
        paginate: { page: 1, count: 10 },
        sort: { name: '_id', type: 'asc' },
      }),
    {
      select: data =>
        data.data.map((el: ActionBlockchainNetworkAll) => ({ value: el._id, label: el.name })),
    },
  );

  const addBlockchainAccountRequest = useMutation({ mutationFn: addBlockchainAccount });

  
  const handleChange = (
    event: ChangeEvent<HTMLInputElement> | FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target as HTMLInputElement;

    setFormData({
      ...formData,
      [name]: value,
    });

    setFormErrors({
      ...formErrors,
      [name]: value.trim() === '',
    });

    setErrorMsg({
      ...errorMsg,
      [name]: 'Please fill this field',
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if (!validate(formData.address)) {
    //   setFormErrors(prevState => ({ ...prevState, address: true }));

    //   setErrorMsg(prevState => ({ ...prevState, address: 'Not valid' }));
    //   return;
    // }

    if (formData.network.trim().length === 0) {
      setFormErrors(prevState => ({ ...prevState, network: true }));
      setErrorMsg(prevState => ({ ...prevState, network: 'Please fill this field' }));

      return;
    }

    if (formData.labels.length === 0) {
      setFormErrors(prevState => ({ ...prevState, labels: true }));
      setErrorMsg(prevState => ({ ...prevState, labels: 'Please fill this field' }));

      return;
    }

    await addBlockchainAccountRequest.mutateAsync(formData);

    setFormData({
      name: '',
      address: '',
      network: '',
      labels: [],
    });
    toast.success('Account was added');
  };

  const { name, address } = formData;

  return (
    <Box sx={{ p: 2 }} bgcolor="white">
      <form onSubmit={handleSubmit}>
        <fieldset>
          <Grid container sx={{ p: 3 }}>
            <Grid alignItems="center" container sx={{ mb: 2 }}>
              <Grid item xs={2}>
                <label htmlFor="name">Name:</label>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  name="name"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={name}
                  onChange={handleChange}
                  onBlur={handleChange}
                />
                {formErrors.name && <Typography color="error">{errorMsg.name}</Typography>}
              </Grid>
            </Grid>
            <Grid alignItems="center" container sx={{ mb: 2 }}>
              <Grid item xs={2}>
                <label htmlFor="address">Public Address:</label>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  name="address"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={address}
                  onChange={handleChange}
                  onBlur={handleChange}
                />
                {formErrors.address && <Typography color="error">{errorMsg.address}</Typography>}
              </Grid>
            </Grid>
            <Grid alignItems="center" container sx={{ mb: 2 }}>
              <Grid item xs={2}>
                <label>Network:</label>
              </Grid>
              <Grid item xs={10}>
                <CustomSelect
                  options={blockchainNetworkData}
                  setFormValue={setFormData}
                  fieldName="network"
                  formValue={formData.network}
                />
                {formErrors.network && <Typography color="error">{errorMsg.network}</Typography>}
              </Grid>
            </Grid>
            <Grid alignItems="center" container sx={{ mb: 2 }}>
              <Grid item xs={2}>
                <label>Labels:</label>
              </Grid>
              <Grid item xs={10}>
                <MultiSelectComponent
                  menuItems={labelsData}
                  fieldName="labels"
                  selectedValues={formData.labels}
                  setSelectedValues={setFormData}
                />
                {formErrors.labels && <Typography color="error">{errorMsg.labels}</Typography>}
              </Grid>
            </Grid>
          </Grid>

          <Box textAlign="right" sx={{ p: 3 }}>
            <Button type="submit" sx={{ mr: 2 }} size="large" variant="contained" color={'primary'}>
              Save
            </Button>
            <Button size="large" variant="contained" onClick={() => onCloseHandler(false)}>
              Close
            </Button>
          </Box>
        </fieldset>
      </form>
    </Box>
  );
};
