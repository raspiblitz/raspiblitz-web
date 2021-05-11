const syncStatus = (ws) => {
  console.log('call to syncstatus');
  ws.send(
    JSON.stringify({
      id: 'syncstatus',
      syncStatus: 20.2,
      onchainBalance: 0.00000001,
      lnBalance: 1.003232,
      currBlock: 202020,
      maxBlock: 500000,
      channelOnline: 3,
      channelTotal: 4
    })
  );

  // check if Websockets really work
  // P.S.: They do. Awesome!
  setTimeout(() => {
    ws.send(
      JSON.stringify({
        id: 'syncstatus',
        syncStatus: 100,
        onchainBalance: 1.00000001,
        lnBalance: 0.42345,
        currBlock: 202021,
        maxBlock: 500000,
        channelOnline: 4,
        channelTotal: 4
      })
    );
  }, 4000);
};

module.exports = { syncStatus };
