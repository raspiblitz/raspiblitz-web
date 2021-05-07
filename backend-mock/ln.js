const transactions = (ws) => {
  console.log('call to ln_transactions');
  ws.send(
    JSON.stringify({
      id: 'ln_transactions',
      transactions: [
        {
          category: 'send',
          amount: -1.00232,
          time: 1610329986,
          comment: "Lightning 123455555555555"
        },
        {
          category: 'receive',
          amount: 1.3232,
          time: 1615746387,
          comment: ''
        },
        {
          category: 'send',
          amount: -4.001234,
          time: 1620222506,
          comment: "LNsend 2"
        },
        {
          category: 'send',
          amount: -4.001234,
          time: 1620222506,
          comment: "LNsend 2"
        },
        {
          category: 'send',
          amount: -4.001234,
          time: 1620222506,
          comment: "LNsend 2"
        },
        {
          category: 'send',
          amount: -4.001234,
          time: 1620222506,
          comment: "LNsend 2"
        },
        {
          category: 'send',
          amount: -4.001234,
          time: 1620222506,
          comment: "LNsend 2"
        },
        {
          category: 'send',
          amount: -4.001234,
          time: 1620222506,
          comment: "LNsend 2"
        },
        {
          category: 'send',
          amount: -4.001234,
          time: 1620222506,
          comment: "LNsend 2"
        },
        {
          category: 'send',
          amount: -4.001234,
          time: 1620222506,
          comment: "LNsend 2"
        },
        {
          category: 'send',
          amount: -4.001234,
          time: 1620222506,
          comment: "LNsend 2"
        },
        {
          category: 'send',
          amount: -4.001234,
          time: 1620222506,
          comment: "LNsend 2"
        },
        {
          category: 'send',
          amount: -4.001234,
          time: 1620222506,
          comment: "LNsend 2"
        },
        {
          category: 'send',
          amount: -4.001234,
          time: 1620222506,
          comment: "LNsend 2"
        },
        {
          category: 'send',
          amount: -4.001234,
          time: 1620222506,
          comment: "LNsend 2"
        },
        {
          category: 'send',
          amount: -4.001234,
          time: 1620222506,
          comment: "LNsend 2"
        },
        {
          category: 'send',
          amount: -4.001234,
          time: 1620222506,
          comment: "LNsend 2"
        },
        {
          category: 'send',
          amount: -4.001234,
          time: 1620222506,
          comment: "LNsend 2"
        },
        {
          category: 'send',
          amount: -4.001234,
          time: 1620222506,
          comment: "LNsend 2"
        }
      ]
    })
  );
};

module.exports = { transactions };
