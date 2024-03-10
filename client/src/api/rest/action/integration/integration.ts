import { baseApi } from '@api/config';
import { ActionIntegrationsRequestData } from '@api/types/action/integration';

export const getIntegrations = async (requestData: ActionIntegrationsRequestData) => {
  const response = await baseApi.post('action/integration/all', requestData);
  return response.data;
};
