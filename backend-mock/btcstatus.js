const util = require('./util');

const btcStatus = () => {
  console.log('call to btcstatus');

  util.sendSSE('btcstatus', {
    syncStatus: 20.2,
    currBlock: 202020,
    maxBlock: 500000,
    btcVersion: 'bitcoin v0.21.1',
    btcStatus: 'Syncing',
    btcNetwork: 'mainnet'
  });
};

module.exports = { btcStatus };
