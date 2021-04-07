import { MouseEventHandler } from 'react';

export interface DashboardBoxProps {
  name: string;
  syncStatus: number;
  icon: JSX.Element;
  transactionBox : boolean;
  transactions?: any[];
  send?: MouseEventHandler;
  receive?: MouseEventHandler;
}
