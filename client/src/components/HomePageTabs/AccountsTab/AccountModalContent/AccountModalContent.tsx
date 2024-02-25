import React, { FC } from 'react';

import { Box, Grid, Typography } from '@mui/material';
import { BlockchainAccountEntity } from '@types/action/blockchain/account';
import { generateRandomColorExcludingWhite } from '@utils/getRandomColor';

import { CustomLabel } from '../../../CustomLabel';

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

export const AccountModalContent: FC<AccountModalContentProps> = ({ data }) => {
  if (!data) {
    return;
  }

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
                  backgroundColor: generateRandomColorExcludingWhite(),
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
    </Grid>
  );
};
