import React, { FC } from 'react';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Grid, TextareaAutosize, Typography } from '@mui/material';

import { BlockchainNetworkEntity } from '../../../../types/action';
import { stringToColour } from '../../../../utils/stringToColor';

interface NetworkModalContentProps {
  data: BlockchainNetworkEntity;
}
const textStyle = {
  display: 'inline',
  padding: '5px',
  backgroundColor: '#bed3a6',
  borderRadius: '8px',
};

export const NetworkModalContent: FC<NetworkModalContentProps> = ({ data }) => {
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
        <Grid item xs={8}>
          <Typography>{data._id}</Typography>
        </Grid>
        <Grid
          item
          xs={2}
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography fontWeight="bold">Family:</Typography>
          <Typography
            sx={{ ...textStyle, backgroundColor: stringToColour(data.family), color: 'white' }}
          >
            {data.family}
          </Typography>
        </Grid>
      </Grid>
      <Grid container alignItems="center">
        <Grid item xs={2}>
          <Typography fontWeight="bold" variant="h6">
            Inner Key
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography sx={textStyle}>{data.innerKey}</Typography>
        </Grid>
        <Grid
          item
          xs={2}
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography fontWeight="bold">Prototype LVL:</Typography>
          <Typography
            sx={{
              ...textStyle,
              backgroundColor: stringToColour(data.prototypeLevel),
              color: 'white',
            }}
          >
            {data.prototypeLevel}
          </Typography>
        </Grid>
      </Grid>
      <Grid container alignItems="center">
        <Grid item xs={2}>
          <Typography fontWeight="bold" variant="h6">
            Name
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography fontWeight="bold">{data.name}</Typography>
        </Grid>
        <Grid
          item
          xs={2}
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography fontWeight="bold">Symbol:</Typography>
          <Typography
            sx={{
              ...textStyle,
              backgroundColor: stringToColour(data.currencySymbol),
              color: 'white',
            }}
          >
            {data.currencySymbol}
          </Typography>
        </Grid>
      </Grid>
      <Grid container alignItems="center">
        <Grid item xs={2}>
          <Typography fontWeight="bold" variant="h6">
            Local Name
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={textStyle}>{data.localName}</Typography>
        </Grid>
      </Grid>
      <Grid container alignItems="center">
        <Grid item xs={2}>
          <Typography fontWeight="bold" variant="h6">
            Network ID
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>{data.networkId}</Typography>
        </Grid>
      </Grid>
      <Grid container alignItems="center">
        <Grid item xs={2}>
          <Typography fontWeight="bold" variant="h6">
            Scan
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>{data.scan}</Typography>
        </Grid>
      </Grid>
      <Grid container alignItems="center">
        <Grid item xs={2}>
          <Typography fontWeight="bold" variant="h6">
            Available
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <FiberManualRecordIcon color={data.available ? 'success' : 'secondary'} />
        </Grid>
      </Grid>
      {data.removedAt && (
        <Grid container alignItems="center">
          <Grid item xs={2}>
            <Typography fontWeight="bold" variant="h6">
              Removed At
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{data.removedAt}</Typography>
          </Grid>
        </Grid>
      )}
      <Grid container alignItems="center" sx={{ pt: 3 }}>
        <Grid item xs={12}>
          <Typography fontWeight="bold" variant="h6">
            Description
          </Typography>
        </Grid>
        <TextareaAutosize
          aria-label="empty textarea"
          placeholder="Введите многострочный текст"
          style={{
            resize: 'none',
            width: '100%',
            minHeight: '100px',
            paddingTop: 10,
            paddingLeft: 30,
          }}
          readOnly
          defaultValue={data.description}
        />
      </Grid>
    </Grid>
  );
};
