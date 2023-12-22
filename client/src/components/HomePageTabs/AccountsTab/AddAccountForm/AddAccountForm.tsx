import React, { FC, FormEvent } from 'react';

import { TextField, Grid, Box, Button } from '@mui/material';

interface AddAccountFormProps {
  onCloseHandler: (state: boolean) => void;
}

export const AddAccountForm: FC<AddAccountFormProps> = ({ onCloseHandler }) => {
  const handleAddAccount = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Box sx={{ p: 2 }} bgcolor="white">
      <form onSubmit={handleAddAccount}>
        <fieldset>
          <Grid container xs={12} sx={{ p: 3 }}>
            <Grid alignItems="center" container xs={12} sx={{ mb: 2 }}>
              <Grid item xs={2}>
                <label htmlFor="name">Name:</label>
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth id="name" variant="outlined" size="small" />
              </Grid>
            </Grid>
            <Grid alignItems="center" container xs={12} sx={{ mb: 2 }}>
              <Grid item xs={2}>
                <label htmlFor="address">Public Address:</label>
              </Grid>
              <Grid item xs={5}>
                <TextField fullWidth id="address" variant="outlined" size="small" />
              </Grid>
            </Grid>
            <Grid alignItems="center" container xs={12} sx={{ mb: 2 }}>
              <Grid item xs={2}>
                <label>Network:</label>
              </Grid>
              <Grid container xs={3}>
                <Button fullWidth variant="contained" color="warning">
                  Select Network
                </Button>
              </Grid>
            </Grid>
            <Grid alignItems="center" container xs={12} sx={{ mb: 2 }}>
              <Grid item xs={2}>
                <label>Labels:</label>
              </Grid>
              <Grid item xs={3}>
                <Button fullWidth variant="contained" color="warning">
                  Multi-select labels
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Box textAlign="right" sx={{ p: 3 }}>
            <Button sx={{ mr: 2 }} size="large" variant="contained" color={'primary'}>
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
