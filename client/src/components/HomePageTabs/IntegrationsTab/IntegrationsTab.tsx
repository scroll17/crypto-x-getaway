import React, { useMemo } from 'react';

import { getIntegrations } from '@api/rest/action/integration';
import {
  ActionIntegrationQueryKeys,
  ActionIntegrationsEntity,
} from '@api/types/action/integration';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Button } from '@mui/material';
import { useQuery } from 'react-query';

import { FullScreenLoader } from '../../FullScreenLoader';
import { Column, TableComponent } from '../../TableComponent';

const columns: Column[] = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Name' },
  { id: 'apiUrl', label: 'Url' },
  {
    id: 'description',
    label: 'Description',
    style: {
      maxWidth: '500px',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },
  { id: 'active', label: 'Active', style: { textAlign: 'center' } },
];

export const IntegrationsTab = () => {
  const integrationsData = useQuery(
    ActionIntegrationQueryKeys.Integrations,
    () =>
      getIntegrations({
        paginate: { page: 1, count: 10 },
        sort: { name: '_id', type: 'asc' },
      }),
    { select: data => data.data },
  );
  const dataExists = integrationsData && integrationsData.data?.length > 0;

  const handleClick = () => {
    integrationsData.refetch();
  };

  const ROW: Record<Column['id'], string>[] = useMemo(() => {
    if (!dataExists) return [];

    const { data } = integrationsData;

    return data.map((row: ActionIntegrationsEntity) => ({
      id: row._id,
      name: row.name,
      apiUrl: row.apiUrl,
      description: row.description,
      active: <FiberManualRecordIcon color={row.active ? 'success' : 'error'} />,
    }));
  }, [integrationsData]);

  if (integrationsData.isFetching) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <Button size="large" variant="contained" onClick={handleClick}>
          Reload
        </Button>
      </div>
      <TableComponent row={ROW} columns={columns} dataCheck={dataExists} />
    </>
  );
};
