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

const apps = () => {
  console.log('call to apps');
  util.sendSSE('apps', [
    { name: 'Bla', description: 'Blockchain Explorer', installed: true },
    { name: 'BLUBBBB', description: 'TEST urf2bkjbehjvbhb3h', installed: false },
    { name: '1234567', description: 'djwbdhwbdhwbdbehjcbbhhhwbbcebhcebhcebhcebehbceh', installed: true },
    { name: '9876541', description: 'BDJCBHJWBJCBWJBJWBJCBJCWBJ', installed: false },
    { name: 'Sphinx Chat1', description: 'Chat', installed: false },
    { name: 'Sphinx Chat2', description: 'Chat', installed: true },
    { name: 'Sphinx Chat3', description: 'Chat', installed: false },
    { name: 'Sphinx Chat4', description: 'Chat', installed: false },
    { name: 'Sphinx Chat5', description: 'Chat', installed: true },
    { name: 'Sphinx Chat6', description: 'Chat', installed: false },
    { name: 'Sphinx Chat7', description: 'Chat', installed: false }
  ]);
};

module.exports = { appStatus, apps };
