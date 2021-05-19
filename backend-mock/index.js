const express = require('express');
const cors = require('cors');
const apps = require('./apps');
const sync = require('./sync');
const transactions = require('./transactions');
const util = require('./util');

const app = express();
app.use(cors(), express.json());

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

/**
 * Main SSE Handler
 */
const eventsHandler = (request, response) => {
  const headers = {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  response.writeHead(200, headers);

  const data = `data: null\n\n`;

  response.write(data);

  const id = util.currClientId++;

  util.clients.push({
    id,
    response
  });

  request.on('close', () => {
    // do nothing
  });
};

/**
 * SSE Handler call
 */
app.get('/events', eventsHandler);

app.post('/receive', (req, res) => {
  if (req.body.type === 'lightning') {
    // include comment & amount for real req ..
    res.send(JSON.stringify({ address: 'lntb1u1pwz5w78pp5e8w8cr5c30xzws92v3' }));
    return;
  }
  res.send(JSON.stringify({ address: 'bcrt1qxunuhx7ve74n6f7z667qrl7wjachdyyzndwdyz' }));
});

app.post('/send', (req, res) => {
  res.send(JSON.stringify({ status: 'success' }));
});

app.post('/changepw', (req, res) => {
  console.log(`call to /changepw with old: ${req.body.oldPassword} & new: ${req.body.newPassword}`);
  res.send('success');
});

app.post('/reboot', (req, res) => {
  console.log('call to /reboot');
  res.send(JSON.stringify({ status: 'success' }));
});

app.post('/shutdown', (req, res) => {
  console.log('call to /shutdown');
  res.send(JSON.stringify({ status: 'success' }));
});

app.get('/syncstatus', (req, res) => {
  sync.syncStatus();
  res.send(JSON.stringify({ status: 'success' }));
});

app.get('/appstatus', (req, res) => {
  apps.appStatus();
  res.send(JSON.stringify({ status: 'success' }));
});

app.get('/transactions', (req, res) => {
  transactions.listTransactions();
  res.send(JSON.stringify({ status: 'success' }));
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
