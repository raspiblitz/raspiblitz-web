const WebSocket = require('ws');
const sync = require('./sync');
const transactions = require('./transactions');
const apps = require('./apps');
const cors = require('cors');
const express = require('express');

const wsPort = 8080;
const restPort = 8081;

const app = express();
app.use(cors(), express.json());

const wss = new WebSocket.Server({ port: wsPort });

wss.on('connection', (ws) => {
  console.log('connected');

  ws.on('message', (message) => {
    onMessage(ws, message);
  });
});

const onMessage = (ws, message) => {
  console.log('new message received', message);
  let parsedMsg;
  try {
    parsedMsg = JSON.parse(message.toString());
  } catch (e) {
    console.log(e);
    ws.send(JSON.stringify({ error: 'error while parsing' }));
  }
  switch (parsedMsg.id) {
    case 'syncstatus':
      sync.syncStatus(ws);
      break;
    case 'transactions':
      transactions.listTransactions(ws);
      break;
    case 'appstatus':
      apps.appStatus(ws);
      break;
    default:
      ws.send(JSON.stringify({ error: 'id not specified' }));
  }
};

console.log(`Started WebSocket Backend on port ${wsPort}`);

/**
 * REST API CALLS
 */

app.listen(restPort, () => {
  console.log(`Example app listening at http://localhost:${restPort}`);
});

app.post('/receive', (req, res) => {
  if (req.body.type === 'lightning') {
    // include comment & amount for real req ..
    res.send({ address: 'lntb1u1pwz5w78pp5e8w8cr5c30xzws92v3' });
    return;
  }
  res.send({ address: 'bcrt1qxunuhx7ve74n6f7z667qrl7wjachdyyzndwdyz' });
});

app.post('/send', (req, res) => {
  res.send('success');
});

app.post('/changepw', (req, res) => {
  console.log(`call to /changepw with old: ${req.body.oldPassword} & new: ${req.body.newPassword}`);
  res.send('success');
});

app.post('/reboot', (req, res) => {
  console.log('call to /reboot');
  res.send('success');
});

app.post('/shutdown', (req, res) => {
  console.log('call to /shutdown');
  res.send('success');
});

app.get('/tx/:id', (req, res) => {
  console.log('call to /tx/' + req.params.id);
  if (req.params.id === 'blablabla') {
    res.send(
      JSON.stringify({
        type: 'onchain', // or lightning
        hash: '4073686402f35297e6f153bceda0fad51645b35243f21324760c1774f384fdf9',
        confirmations: 2,
        date: 1618501200, // epoch timestamp
        block: 683738, // can be null if not confirmed
        feeRate: 61.9, // sat/vByte
        fee: 0.00158274,
        description: 'hi!' // if available
      })
    );
  } else {
    res.send(
      JSON.stringify({
        type: 'lightning',
        hash: '1d4443dcad965200d01c0ee34332grfwqwe76j',
        request:
          'LNBC50509VKAVKAVKAVAKVAKVKAVKAVKBLABLABLABLSBLABLSABSLABSALAALBASLSBALBSGSDQ6XGSV89EQGF6KUERVV5S8QCTRDVCQZPGXQRRSSSP538GMWU7BYNZ5FKJG4PDUN2GGMDCJJV9MHJARKDR3CJS9QY9QSQ6UVDP99NYTD',
        status: 'SUCCEEDED',
        date: '1618501200', // epoch timestamp
        fee: 2, // (mSats)
        value: 100000, // (mSats) => 100 sat
        description: 'hi!' // if available
      })
    );
  }
});
