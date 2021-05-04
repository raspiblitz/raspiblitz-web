const syncStatus = (ws) => {
    console.log('call to syncStatus');
    ws.send(
      JSON.stringify({
        id: 'syncstatus',
        btcSync: 20.2,
        lnSync: 10.0,
        lnBalance: 1.003232,
        btcBalance: 1.00000001,
        currBlock: 202020,
        maxBlocks: 500000
      })
    );

    // check if Websockets really work
    // P.S.: They do. Awesome!
    setTimeout(() => {
      ws.send(
        JSON.stringify({
          id: 'syncstatus',
          btcSync: 25.2,
          lnSync: 100,
          btcBalance: 2.00000001,
          lnBalance: 0.42345,
          currBlock: 202021,
          maxBlocks: 500000
        })
      );
    }, 3000);
  };

  module.exports = { syncStatus };