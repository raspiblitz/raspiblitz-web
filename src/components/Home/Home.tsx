import React, { Component } from 'react';
import DashboardBox from '../Shared/DashboardBox/DashboardBox';
import { ReactComponent as BitcoinLogo } from '../../assets/bitcoin-circle.svg';
import { ReactComponent as LightningLogo } from '../../assets/lightning.svg';
import axios from 'axios';
import ReceiveModal from '../Shared/ReceiveModal/ReceiveModal';

export class Home extends Component {
  state = {
    syncStatus: undefined,
    btcBalance: undefined,
    currBlocks: undefined,
    maxBlocks: undefined,
    showReceiveModal: false,
    receiveAddr: undefined
  };

  componentDidMount() {
    axios
      .get('http://localhost:4000/syncstatus')
      .then((res) =>
        this.setState({
          syncStatus: res.data.btcProgress,
          btcBalance: res.data.btcBalance,
          currBlocks: res.data.currentBlocks,
          maxBlocks: res.data.maxBlocks
        })
      )
      .catch((err) => console.log(err));
  }

  sendBtcHandler = () => {
    console.log('sendBtcHandler');
  };

  receiveBtcHandler = () => {
    console.log('receiveBtcHandler');
    axios
      .get('http://localhost:4000/receivepayment')
      .then((res) => this.setState({ receiveAddr: res.data, showReceiveModal: true }))
      .catch((err) => console.log(err));
  };

  closeReceiveModalHandler = () => {
    console.log('closeModal');
    this.setState({ showReceiveModal: false });
  };

  sendLightningHandler = () => {
    console.log('sendLightningHandler');
  };

  receiveLightningHandler = () => {
    console.log('receiveLightningHandler');
  };

  render(): JSX.Element {
    const modal = this.state.showReceiveModal ? (
      <ReceiveModal close={this.closeReceiveModalHandler} address={this.state.receiveAddr}></ReceiveModal>
    ) : null;
    return (
      <React.Fragment>
        {modal}
        <div className='content-container w-full bg-gray-300 dark:bg-gray-600 dark:text-white transition-colors'>
          <div className='py-8'>
            <div className='flex flex-col md:flex-row flex-wrap lg:flex-nowrap w-full items-start'>
              <DashboardBox
                name='Bitcoin Core'
                icon={<BitcoinLogo className='w-10 h-10' />}
                transactionBox
                balance={
                  this.state.btcBalance || this.state.btcBalance === 0 ? this.state.btcBalance + ' BTC' : undefined
                }
                syncStatus={this.state.syncStatus}
                send={this.sendBtcHandler.bind(this)}
                receive={this.receiveBtcHandler.bind(this)}
              ></DashboardBox>
              <DashboardBox
                name='Lightning'
                icon={<LightningLogo className='w-10 h-10' />}
                transactionBox
                send={this.sendLightningHandler}
                receive={this.receiveLightningHandler}
              ></DashboardBox>
              <DashboardBox name='Services'></DashboardBox>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
