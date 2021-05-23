const util = require('./util');

const appStatus = () => {
  console.log('call to appstatus');
  util.sendSSE('appstatus', [
    {
      name: 'Mempool Space',
      status: 'online'
    },
    {
      name: 'ElectRS',
      status: 'online'
    },
    {
      name: 'ThunderHub',
      status: 'offline'
    },
    {
      name: 'LIT',
      status: 'online'
    },
    {
      name: 'Balance of Satoshis',
      status: 'online'
    }
  ]);

  setTimeout(() => {
    util.sendSSE('appstatus', [
      {
        name: 'Mempool Space',
        status: 'online'
      },
      {
        name: 'ElectRS',
        status: 'online'
      },
      {
        name: 'ThunderHub',
        status: 'offline'
      },
      {
        name: 'LIT',
        status: 'offline'
      },
      {
        name: 'Balance of Satoshis',
        status: 'offline'
      },
      {
        name: 'Balance of Satoshis',
        status: 'offline'
      },
      {
        name: 'Balance of Satoshis',
        status: 'offline'
      },
      {
        name: 'Balance of Satoshis',
        status: 'offline'
      },
      {
        name: 'Balance of Satoshis',
        status: 'offline'
      },
      {
        name: 'Balance of Satoshis',
        status: 'offline'
      },
      {
        name: 'Balance of Satoshis',
        status: 'offline'
      }
    ]);
  }, 5000);
};

const listApps = () => {
  console.log('call to apps');
  util.sendSSE('apps', [
    { id: 'sphinx', name: 'Sphinx Chat', description: 'Chat over Lightning', installed: true },
    { id: 'btc-rpc-explorer', name: 'BTC ', description: 'Bitcoin RPC Explorer', installed: false },
    { id: 'sphinx', name: '1234567', description: 'djwbdhwbdhwbdbehjcbbhhhwbbcebhcebhcebhcebehbceh', installed: true },
    { id: 'sphinx', name: '9876541', description: 'BDJCBHJWBJCBWJBJWBJCBJCWBJ', installed: false },
    { id: 'sphinx', name: 'Sphinx Chat1', description: 'Chat', installed: false },
    { id: 'sphinx', name: 'Sphinx Chat2', description: 'Chat', installed: true },
    { id: 'sphinx', name: 'Sphinx Chat3', description: 'Chat', installed: false },
    { id: 'sphinx', name: 'Sphinx Chat4', description: 'Chat', installed: false },
    { id: 'sphinx', name: 'Sphinx Chat5', description: 'Chat', installed: true },
    { id: 'sphinx', name: 'Sphinx Chat6', description: 'Chat', installed: false },
    { id: 'sphinx', name: 'Sphinx Chat7', description: 'Chat', installed: false }
  ]);
};

module.exports = { appStatus, listApps };
