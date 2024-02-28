import { TPaginateRequest } from '../../common';

export enum ActionIntegrationQueryKeys {
  Integrations = 'integrations',
}

export type ActionIntegrationsRequestData = TPaginateRequest<object>;

export interface ActionIntegrationsEntity {
  _id: string;
  key: string;
  name: string;
  apiUrl: string;
  description: string;
  active: boolean;
}
