import { baseApi } from '@api/config';
import {
  ActionWalletInspectorBuildTransactionsReportRequestData,
  ActionWalletInspectorGetNetworksRequestData,
  ActionWalletInspectorTransactionsReport
} from '@types/action/wallet-inspector';

export const getAllWalletInspectorNetworks = async (requestData: ActionWalletInspectorGetNetworksRequestData) => {
  const response = await baseApi.get<string[]>('action/wallet-inspector/networks', { params: requestData });
  return response.data;
};

export const buildWalletInspectorTransactionReport = async (requestData: ActionWalletInspectorBuildTransactionsReportRequestData) => {
  const response = await baseApi.post<ActionWalletInspectorTransactionsReport>('action/wallet-inspector/build-transactions-report', requestData);
  return response.data;
};