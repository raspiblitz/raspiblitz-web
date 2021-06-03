const util = require('./util');

const syncStatus = () => {
  console.log('call to syncstatus');
  util.sendSSE('syncstatus', {
    syncStatus: 20.2,
    onchainBalance: 0.00000001,
    lnBalance: 1.003232,
    currBlock: 202020,
    maxBlock: 500000,
    channelOnline: 3,
    channelTotal: 4,
    btcVersion: 'bitcoin v0.21.1',
    btcStatus: 'Syncing',
    btcNetwork: 'mainnet',
    lnVersion: 'LND 0.12.1-beta',
    lnStatus: 'online',
    torAddress: 'pg6mmjiyjmcrsslvykfwnntlaru7p5svn6y2ymmju6nubxndf4pscryd.onion',
    sshAddress: 'admin@192.168.0.1'
  });

  setTimeout(() => {
    util.sendSSE('syncstatus', {
      syncStatus: 100,
      onchainBalance: 1.00000001,
      lnBalance: 0.42345,
      currBlock: 202021,
      maxBlock: 500000,
      channelOnline: 4,
      channelTotal: 4
    });
  }, 4000);
};

module.exports = { syncStatus };
