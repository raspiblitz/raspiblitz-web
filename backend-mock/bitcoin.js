const syncStatus = (ws) => {
  console.log('call to syncStatus');
  ws.send(
    JSON.stringify({
      id: 1,
      btcSync: 20.2,
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
        id: 1,
        btcSync: 25.2,
        btcBalance: 2.00000001,
        currBlock: 202021,
        maxBlocks: 500000
      })
    );
  }, 3000);
};

const transactions = (ws) => {
  console.log('call to transactions');
  ws.send(
    JSON.stringify({
      id: 2,
      transactions: [
        {
          category: 'send',
          amount: -2.00232,
          time: 1610339986,
          comment: "Young man, there's a place you can go"
        },
        {
          category: 'receive',
          amount: 1.34656781,
          time: 1614746386,
          comment: ''
        },
        {
          category: 'send',
          amount: -0.001234,
          time: 1620062506,
          comment: "I said, young man, when you're short on your dough"
        }
      ]
    })
  );
};

const receivePayment = (ws) => {
  console.log('call to receivePayment');
  ws.send(
    JSON.stringify({
      id: 4,
      address: 'bcrt1qxunuhx7ve74n6f7z667qrl7wjachdyyzndwdyz'
    })
  );
};

const sendPayment = (ws) => {
  console.log('call to sendPayment');
  ws.send(
    JSON.stringify({
      id: 5,
      status: 'successful'
    })
  );
};

module.exports = { syncStatus, transactions, receivePayment, sendPayment };
