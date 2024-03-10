import React, {FC, useMemo, useState} from 'react';

import {buildWalletInspectorTransactionReport} from '@api-r/action/wallet-inspector';
import {
  ActionWalletInspectorBuildTransactionsReportRequestData,
  ActionWalletInspectorTransactionsReport,
  ActionWalletInspectorTransactionsReportItem
} from '@types/action/wallet-inspector';
import {useMutation, } from 'react-query';
import {toast} from 'react-toastify';

import {ConfigWalletInspectorForm} from './ConfigWalletInspectorForm';
import {WalletInspectorTableComponent} from './WalletInspectorTableComponent';
import {FullScreenLoader} from '../../FullScreenLoader';


export const WalletInspectorTab: FC = () => {
  const [lastTransactionsReport, setTransactionsReport] = useState<ActionWalletInspectorTransactionsReport | null>(null);

  const buildTransactionsReportRequest = useMutation({
    mutationFn: buildWalletInspectorTransactionReport,
    onSuccess: (data) => {
      toast.success('Transactions report was built successfully');
      setTransactionsReport(data);
    },
    onError: (error: Error) => {
      toast.error(`Error during transactions report build: "${error.message}"`);
      console.log('build transactions report error', error);
    }
  });

  const fetchTransactionsReport = (data: ActionWalletInspectorBuildTransactionsReportRequestData) => {
    toast.info('Start building transactions report');
    buildTransactionsReportRequest.mutate(data);
  };

  const ROW = useMemo(() => {
    if(!lastTransactionsReport) return [];
    
    const { items, total } = lastTransactionsReport;
    
    const rows = items.map((row: ActionWalletInspectorTransactionsReportItem) => ({
      address: row.address,
      eth: row.eth,
      volume: row.volume,
      gasUsed: row.gasUsed,
      txCount: row.txCount,
      dContracts: row.dContracts,
      uContracts: row.uContracts,
      uDays: row.uDays,
      uWeeks: row.uWeeks,
      uMonths: row.uMonths,
      firstTxDate: row.firstTxDate,
      lastTxDate: row.lastTxDate,
      fee: row.fee,
      gasPrice: row.gasPrice,
    }));

    rows.push({
      eth: total.totalEth,
      volume: total.totalVolume,
      fee: total.totalFee,
      gasPrice: total.totalGasPrice,
    } as any);

    return rows;
  }, [lastTransactionsReport]);

  if(!lastTransactionsReport || lastTransactionsReport.items.length === 0) {
    return (
      <>
        <div>
          <ConfigWalletInspectorForm onSubmitHandler={fetchTransactionsReport} />
        </div>
        <div style={{ height: '30px' }}/>
        {
          buildTransactionsReportRequest.isLoading
            ? <div style={{ display: 'flex', height: '300px' }}><FullScreenLoader /></div>
            : (
              <div
                style={{
                  margin: 'auto',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}
              >
                There is no data
              </div>
            )
        }
      </>
    );
  }

  const columns = lastTransactionsReport.columns
    .sort((a, b) => a.index - b.index)
    .map(c => ({
      id: String(c.fieldName),
      label: <span title={c.focusName}>{c.columnName}</span>,
    }));

  return (
    <>
      <div>
        <ConfigWalletInspectorForm onSubmitHandler={fetchTransactionsReport} />
      </div>
      <div style={{ height: '30px' }}/>
      <WalletInspectorTableComponent
        row={ROW}
        columns={columns}
        dataCheck={lastTransactionsReport.items.length > 0}
        isLoading={buildTransactionsReportRequest.isLoading}
      />
    </>
  );
};
