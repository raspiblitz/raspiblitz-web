import { FC, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../store/app-context';
import ReceiveModal from '../Shared/ReceiveModal/ReceiveModal';
import SendModal from '../Shared/SendModal/SendModal';
import AppBox from './AppBox/AppBox';
import BitcoinBox from './BitcoinBox/BitcoinBox';
import LNBox from './LNBox/LNBox';

export const Home: FC<{ ws: WebSocket }> = (props) => {
  const appCtx = useContext(AppContext);
  const [homeState, setHomeState] = useState<HomeState>({
    btcSync: 0,
    lnSync: 0,
    btcBalance: 0,
    lnBalance: 0,
    currBlock: 0,
    maxBlocks: 0,
    showReceiveModal: false,
    showSendModal: false,
    receiveAddr: null
  });

  const [appStatus, setAppStatus] = useState<any[]>([]);

  const [btcTx, setBtcTx] = useState([]);
  const [lnTx, setLnTx] = useState([]);

  const { ws } = props;

  // TODO: move out to extra hook
  useEffect(() => {
    if (ws) {
      ws.onmessage = (msg) => {
        const message = JSON.parse(msg.data);

        switch (message.id) {
          case 'syncstatus':
            setHomeState((prev: any) => {
              return {
                ...prev,
                btcSync: message.btcSync,
                lnSync: message.lnSync,
                btcBalance: +message.btcBalance,
                lnBalance: +message.lnBalance,
                currBlock: message.currBlock,
                maxBlocks: message.maxBlocks
              };
            });
            break;
          case 'btc_transactions':
            setBtcTx(message.transactions);
            break;
          case 'btc_receive_payment':
            setHomeState((prevState) => {
              return { ...prevState, receiveAddr: message.address, showReceiveModal: true };
            });
            break;
          case 'ln_transactions':
            setLnTx(message.transactions);
            break;
          case 'app_status':
            setAppStatus(message.apps);
            break;
          default:
            return;
        }
      };

      ws.send(JSON.stringify({ id: 'syncstatus' }));
      ws.send(JSON.stringify({ id: 'btc_transactions' }));
      ws.send(JSON.stringify({ id: 'ln_transactions' }));
      ws.send(JSON.stringify({ id: 'app_status' }));
    }
  }, [ws]);

  const sendBtcHandler = () => {
    setHomeState((prevState) => {
      return { ...prevState, showSendModal: true };
    });
  };

  const receiveBtcHandler = () => {
    ws.send(JSON.stringify({ id: 'btc_receive_payment' }));
  };

  const sendLnHandler = () => {
    console.log('sendLnHandler');
  };

  const receiveLnHandler = () => {
    console.log('receiveLnHandler');
  };

  const closeReceiveModalHandler = () => {
    setHomeState((prevState) => {
      return { ...prevState, showReceiveModal: false };
    });
  };

  const closeSendModalHandler = () => {
    setHomeState((prevState) => {
      return { ...prevState, showSendModal: false };
    });
  };

  const btcBalance = appCtx.unit === 'BTC' ? homeState.btcBalance : Math.round(homeState.btcBalance * 100_000_000);

  const lnBalance = appCtx.unit === 'BTC' ? homeState.lnBalance : Math.round(homeState.lnBalance * 100_000_000);

  const receiveModal = homeState.showReceiveModal && (
    <ReceiveModal close={closeReceiveModalHandler} address={homeState.receiveAddr || ''} />
  );

  const sendModal = homeState.showSendModal && <SendModal balance={btcBalance} close={closeSendModalHandler} ws={ws} />;

  return (
    <>
      {receiveModal}
      {sendModal}
      <div className='h-auto w-full dark:text-white transition-colors'>
        <div className='h-full grid gap-4 grid-cols-1 grid-rows-3 md:grid-cols-2 md:grid-rows-2 xl:grid-cols-3 xl:grid-rows-3'>
          <BitcoinBox
            name='Bitcoin Core'
            balance={btcBalance}
            transactions={btcTx}
            syncStatus={homeState.btcSync}
            send={sendBtcHandler}
            receive={receiveBtcHandler}
          ></BitcoinBox>
          <LNBox
            name='Lightning'
            balance={lnBalance}
            transactions={lnTx}
            syncStatus={homeState.lnSync}
            send={sendLnHandler}
            receive={receiveLnHandler}
          ></LNBox>
          <AppBox apps={appStatus}></AppBox>
        </div>
      </div>
    </>
  );
};

export default Home;

export interface HomeState {
  btcSync: number;
  lnSync: number;
  btcBalance: number;
  lnBalance: number;
  currBlock: number;
  maxBlocks: number;
  showReceiveModal: boolean;
  showSendModal: boolean;
  receiveAddr: string | null;
}
