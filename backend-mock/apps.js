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

module.exports = { appStatus };
