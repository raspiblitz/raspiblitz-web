import { MouseEventHandler } from 'react';

export interface DashboardBoxProps {
  name: string;
  syncStatus: number;
  balance?: string;
  icon: JSX.Element;
  transactionBox : boolean;
  transactions?: any[];
  send?: MouseEventHandler;
  receive?: MouseEventHandler;
}
