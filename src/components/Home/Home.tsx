import axios from 'axios';
import { useEffect, useState } from 'react';
import BitcoinBox from '../Shared/BitcoinBox/BitcoinBox';
import ReceiveModal from '../Shared/ReceiveModal/ReceiveModal';
import SendModal from '../Shared/SendModal/SendModal';

export const Home = () => {
  const [homeState, setHomeState] = useState({
    syncStatus: undefined,
    btcBalance: undefined,
    currBlocks: undefined,
    maxBlocks: undefined,
    showReceiveModal: false,
    showSendModal: false,
    receiveAddr: undefined
  });

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:4000/syncstatus')
      .then((res) => {
        setHomeState((prevState: any) => {
          return {
            ...prevState,
            syncStatus: res.data.btcProgress,
            btcBalance: res.data.btcBalance,
            currBlocks: res.data.currentBlocks,
            maxBlocks: res.data.maxBlocks
          };
        });
      })
      .catch((err) => console.log(err));

    axios
      .get('http://localhost:4000/getbtctransactions')
      .then((res) => {
        setTransactions(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const sendBtcHandler = () => {
    setHomeState((prevState: any) => {
      return { ...prevState, showSendModal: true };
    });
  };

  const receiveBtcHandler = () => {
    console.log('receiveBtcHandler');
    axios
      .get('http://localhost:4000/receivepayment')
      .then((res) =>
        setHomeState((prevState: any) => {
          return { ...prevState, receiveAddr: res.data, showReceiveModal: true };
        })
      )
      .catch((err: any) => console.log(err));
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

  const balance = homeState.btcBalance || homeState.btcBalance === 0 ? homeState.btcBalance + ' BTC' : undefined;

  const receiveModal = homeState.showReceiveModal && (
    <ReceiveModal close={closeReceiveModalHandler} address={homeState.receiveAddr} />
  );

  const sendModal = homeState.showSendModal && <SendModal balance={balance} close={closeSendModalHandler} />;

  return (
    <>
      {receiveModal}
      {sendModal}
      <div className='content-container w-full bg-gray-300 dark:bg-gray-600 dark:text-white transition-colors'>
        <div className='py-8'>
          <div className='flex flex-col md:flex-row flex-wrap lg:flex-nowrap w-full items-start'>
            <BitcoinBox
              name='Bitcoin Core'
              balance={balance}
              transactions={transactions}
              syncStatus={homeState.syncStatus}
              send={sendBtcHandler}
              receive={receiveBtcHandler}
            ></BitcoinBox>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
