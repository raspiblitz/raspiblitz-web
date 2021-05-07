import { useEffect, useState } from 'react';
import BitcoinBox from './BitcoinBox/BitcoinBox';
import LNBox from './LNBox/LNBox';
import ReceiveModal from '../Shared/ReceiveModal/ReceiveModal';
import SendModal from '../Shared/SendModal/SendModal';
import AppBox from './AppBox/AppBox';

export const Home = (props: any) => {
  const [homeState, setHomeState] = useState({
    btcSync: undefined,
    lnSync: undefined,
    btcBalance: undefined,
    lnBalance: undefined,
    currBlock: undefined,
    maxBlocks: undefined,
    showReceiveModal: false,
    showSendModal: false,
    receiveAddr: undefined
  });

  const [appStatus, setAppStatus] = useState<any[]>([]);

  const [btcTx, setBtcTx] = useState([]);
  const [lnTx, setLnTx] = useState([]);

  const { ws } = props;

  useEffect(() => {
    if (ws) {
      ws.onmessage = (msg: any) => {
        console.log(msg);
        const message = JSON.parse(msg.data);

        switch (message.id) {
          case 'syncstatus':
            setHomeState((prev: any) => {
              return {
                ...prev,
                btcSync: message.btcSync,
                lnSync: message.lnSync,
                btcBalance: message.btcBalance,
                lnBalance: message.lnBalance,
                currBlock: message.currBlock,
                maxBlocks: message.maxBlocks
              };
            });
            break;
          case 'btc_transactions':
            setBtcTx(message.transactions);
            break;
          case 'btc_receive_payment':
            setHomeState((prevState: any) => {
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
    setHomeState((prevState: any) => {
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
    setHomeState((prevState: any) => {
      return { ...prevState, showReceiveModal: false };
    });
  };

  const closeSendModalHandler = () => {
    setHomeState((prevState: any) => {
      return { ...prevState, showSendModal: false };
    });
  };

  const btcBalance = homeState.btcBalance || homeState.btcBalance === 0 ? homeState.btcBalance + ' BTC' : undefined;
  const lnBalance = homeState.lnBalance || homeState.lnBalance === 0 ? homeState.lnBalance + ' BTC' : undefined;

  const receiveModal = homeState.showReceiveModal && (
    <ReceiveModal close={closeReceiveModalHandler} address={homeState.receiveAddr} />
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
