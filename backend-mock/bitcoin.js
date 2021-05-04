const transactions = (ws) => {
  console.log('call to btc_transactions');
  ws.send(
    JSON.stringify({
      id: 'btc_transactions',
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
  console.log('call to btc_receive_payment');
  ws.send(
    JSON.stringify({
      id: 'btc_receive_payment',
      address: 'bcrt1qxunuhx7ve74n6f7z667qrl7wjachdyyzndwdyz'
    })
  );
};

const sendPayment = (ws) => {
  console.log('call to btc_send_payment');
  ws.send(
    JSON.stringify({
      id: 'btc_receive_payment',
      status: 'successful'
    })
  );
};

module.exports = { transactions, receivePayment, sendPayment };
