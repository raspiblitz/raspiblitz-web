const appStatus = (ws) => {
  console.log('call to app_status');
  ws.send(
    JSON.stringify({
      id: 'app_status',
      apps: [
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
      ]
    })
  );

  setTimeout(() => {
    ws.send(
      JSON.stringify({
        id: 'app_status',
        apps: [
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
        ]
      })
    );
  }, 5000);
};

module.exports = { appStatus };
