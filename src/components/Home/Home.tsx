import { useEffect, useState } from 'react';
import BitcoinBox from '../Shared/BitcoinBox/BitcoinBox';
import LNBox from '../Shared/LNBox/LNBox';
import ReceiveModal from '../Shared/ReceiveModal/ReceiveModal';
import SendModal from '../Shared/SendModal/SendModal';

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
          // bitcoin transactions
          case 2:
            setBtcTx(message.transactions);
            break;
          // bitcoin receive payment
          case 4:
            setHomeState((prevState: any) => {
              return { ...prevState, receiveAddr: message.address, showReceiveModal: true };
            });
            break;
          case 'ln_transactions':
          default:
            return;
        }
      };

      ws.send(JSON.stringify({ id: 'syncstatus' }));
      ws.send(JSON.stringify({ id: 2 }));
    }
  }, [ws]);

  const sendBtcHandler = () => {
    setHomeState((prevState: any) => {
      return { ...prevState, showSendModal: true };
    });
  };

  const receiveBtcHandler = () => {
    ws.send(JSON.stringify({ id: 4 }));
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
      <div className='content-container w-full h-full bg-gray-300 dark:bg-gray-600 dark:text-white transition-colors'>
        <div className='py-8'>
          <div className='flex flex-col md:flex-row flex-wrap lg:flex-nowrap w-full items-start'>
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
              send={sendBtcHandler}
              receive={receiveBtcHandler}
            ></LNBox>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
