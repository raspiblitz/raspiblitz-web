const listTransactions = (ws) => {
  console.log('call to transactions');
  ws.send(
    JSON.stringify({
      id: 'transactions',
      transactions: [
        {
          category: 'send',
          type: 'onchain',
          amount: -1.00232,
          time: 1610329986,
          comment: 'Lightning 123455555555555'
        },
        {
          category: 'receive',
          type: 'lightning',
          amount: 1.3232,
          time: 1615746387,
          comment: ''
        },
        {
          category: 'send',
          amount: -4.001234,
          type: 'lightning',
          time: 1620222506,
          comment: 'LNsend 2'
        },
        {
          category: 'send',
          amount: -4.001234,
          type: 'lightning',
          time: 1620222506,
          comment: 'LNsend 2'
        },
        {
          category: 'send',
          amount: -4.001234,
          type: 'onchain',
          time: 1620222506,
          comment: 'LNsend 2'
        },
        {
          category: 'send',
          amount: -4.001234,
          type: 'onchain',
          time: 1620222506,
          comment: 'LNsend 2'
        },
        {
          category: 'send',
          amount: -4.001234,
          type: 'onchain',
          time: 1620222506,
          comment: 'LNsend 2'
        },
        {
          category: 'send',
          amount: -4.001234,
          type: 'onchain',
          time: 1620222506,
          comment: 'LNsend 2'
        },
        {
          category: 'send',
          amount: -4.001234,
          type: 'onchain',
          time: 1620222506,
          comment: 'LNsend 2'
        },
        {
          category: 'send',
          amount: -4.001234,
          type: 'onchain',
          time: 1620222506,
          comment: 'LNsend 2'
        },
        {
          category: 'send',
          amount: -4.001234,
          type: 'onchain',
          time: 1620222506,
          comment: 'LNsend 2'
        },
        {
          category: 'send',
          amount: -4.001234,
          type: 'onchain',
          time: 1620222506,
          comment: 'LNsend 2'
        },
        {
          category: 'send',
          amount: -4.001234,
          type: 'onchain',
          time: 1620222506,
          comment: 'LNsend 2'
        },
        {
          category: 'send',
          amount: -4.001234,
          type: 'onchain',
          time: 1620222506,
          comment: 'LNsend 2'
        },
        {
          category: 'send',
          amount: -4.001234,
          type: 'onchain',
          time: 1620222506,
          comment: 'LNsend 2'
        }
      ]
    })
  );
};

module.exports = { listTransactions };
