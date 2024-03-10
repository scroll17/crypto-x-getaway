export enum ActionWalletInspectorQueryKeys {
  Networks = 'walletInspectorNetworks',
}

export type ActionWalletInspectorGetNetworksRequestData = {
  onlyActive: boolean
}

export interface ActionWalletInspectorBuildTransactionsReportRequestData {
  network: string;
  addresses: string[];
}

export interface ActionWalletInspectorTransactionsReportColumn {
  index: number;
  fieldName: string;
  columnName: string;
  focusName: string;
}

export interface ActionWalletInspectorTransactionsReportItem {
  address: string;
  eth: string;
  txCount: number;
  volume: string;
  gasUsed: string;
  dContracts: number;
  uContracts: number;
  uDays: number;
  uWeeks: number;
  uMonths: number;
  firstTxDate: string;
  lastTxDate: string;
  fee: string;
  gasPrice: string;
}

export interface ActionWalletInspectorTransactionsReportTotal {
  totalEth: string;
  totalVolume: string;
  totalFee: string;
  totalGasPrice: string;
}

export interface ActionWalletInspectorTransactionsReport {
  columns: ActionWalletInspectorTransactionsReportColumn[];
  items: ActionWalletInspectorTransactionsReportItem[];
  total: ActionWalletInspectorTransactionsReportTotal;
}
