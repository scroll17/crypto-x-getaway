import React, { FC, useState } from 'react';

import { Box, Grid, Typography } from '@mui/material';
import { BlockchainAccountEntity } from '@types/action/blockchain/account';
import { stringToColour } from '@utils/stringToColor';

import { CustomLabel } from '../../../CustomLabel';
import { CustomTabs } from '../../../CustomTabs/CustomTabs';

interface AccountModalContentProps {
  data: BlockchainAccountEntity;
}

const boxStyle = {
  display: 'inline-block',
  padding: '10px',
  height: 'inherit',
  backgroundColor: 'tomato',
  color: 'white',
};

const tabLabels = ['Comments', 'Adress', 'Network', 'Transactions'];

export const AccountModalContent: FC<AccountModalContentProps> = ({ data }) => {
  const [value, setValue] = useState(0);
  if (!data) {
    return;
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Grid sx={{ border: '2px dashed', p: 3 }} container rowGap={2}>
      <Grid borderBottom="2px solid" container>
        <Typography variant="h6" sx={{ pb: 2 }}>
          {data.name}
        </Typography>
      </Grid>
      <Grid container alignItems="center">
        <Grid item xs={2}>
          <Typography fontWeight="bold" variant="h6">
            ID
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>{data._id}</Typography>
        </Grid>
        <Grid item xs={4} textAlign="right">
          <Box sx={boxStyle}>{data.network?.name ?? '<undefined>'}</Box>
        </Grid>
      </Grid>
      <Grid container alignItems="center">
        <Grid item xs={2}>
          <Typography fontWeight="bold" variant="h6">
            Name
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>{data.name}</Typography>
        </Grid>
      </Grid>
      <Grid container alignItems="center">
        <Grid item xs={2}>
          <Typography fontWeight="bold" variant="h6">
            Labels
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>
            {data.labels.map((label, index) => (
              <CustomLabel
                text={label}
                customStyle={{
                  backgroundColor: stringToColour(label),
                  color: 'white',
                }}
                key={index}
                component="span"
              />
            ))}
          </Typography>
        </Grid>
      </Grid>
      <Grid container alignItems="center">
        <Grid item xs={2}>
          <Typography fontWeight="bold" variant="h6">
            CreatedBy
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>{data.createdBy.name}</Typography>
        </Grid>
      </Grid>
      <Grid container alignItems="center">
        <Grid item xs={2}>
          <Typography fontWeight="bold" variant="h6">
            Adress
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>{data.address}</Typography>
        </Grid>
      </Grid>
      <Grid container alignItems="center" sx={{ pt: 3 }}>
        <Grid item xs={12}>
          <CustomTabs
            value={value}
            tabLabels={tabLabels}
            tabs={[
              { index: 0, renderContent: () => 'hekko1' },
              { index: 1, renderContent: () => 'hekko2' },
            ]}
            onChangeTab={handleTabChange}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
