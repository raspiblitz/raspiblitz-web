const express = require('express');
const cors = require('cors');
const apps = require('./apps');
const sync = require('./sync');
const auth = require('./auth');
const transactions = require('./transactions');
const util = require('./util');

const app = express();
app.use(cors(), express.json());

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

app.use('/', express.static('../build'));

/**
 * Main SSE Handler
 */
const eventsHandler = (request, response) => {
  console.log('call to /events');
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

  sync.syncStatus();
  apps.appStatus();
  apps.listApps();
  transactions.listTransactions();

  request.on('close', () => {
    // do nothing
  });
};

/**
 * SSE Handler call
 */
app.get('/sse/subscribe', eventsHandler);

/***
 * STATUS
 * 100 if setup is done, otherwise step in the setup process
 */
app.get('/setup/status', (_, res) => {
  console.log('call to setup/status');
  res.send(JSON.stringify({ progress: 100 }));
});

/***
 * AUTH
 */

app.post('/system/login', (req, res) => {
  console.log('call to /system/login');
  setTimeout(() => {
    if (req.body.password === 'password') {
      const token = auth.signToken();
      res.status(200).send(JSON.stringify({ token }));
    } else {
      res.status(401).send();
    }
  }, 100);
});

app.post('/logout', (req, res) => {
  console.log('call to /logout');
  res.status(200).send();
});

/***
 * SYNC
 */

// TODO: send back response
app.get('/syncstatus', (req, res) => {
  // sync.syncStatus();
  res.status(200).send();
});

/**
 * SETTINGS
 */

app.post('/changepw', (req, res) => {
  console.log(`call to /changepw with old: ${req.body.oldPassword} & new: ${req.body.newPassword}`);
  res.send('success');
});

app.post('/system/reboot', (req, res) => {
  console.log('call to /system/reboot');
  res.status(200).send();
});

app.post('/system/shutdown', (req, res) => {
  console.log('call to /system/shutdown');
  res.status(200).send();
});

/***
 * APPS
 */

// TODO: send back response
app.get('/appstatus', (req, res) => {
  // apps.appStatus();
  res.status(200).send();
});

// TODO: send back response
app.get('/apps', (req, res) => {
  // apps.listApps();
  res.status(200).send();
});

app.post('/install', (req, res) => {
  console.log('call to /install for app', req.body.id);
  // send information that btc-pay is currently installing
  util.sendSSE('install', { id: 'btc-pay' });
  setTimeout(() => {
    apps.installApp();
  }, 5000);
  res.status(200).send();
});

app.post('/uninstall', (req, res) => {
  console.log('call to /uninstall for app', req.body.id);
  // TODO
  res.status(200).send();
});

app.get('/appdetails/:id', (req, res) => {
  console.log('call to appdetails with id: ' + req.params.id);
  const details = apps.appDetails(req);
  res.send(details);
});

/***
 * TRANSACTIONS
 */

app.post('/receive', (req, res) => {
  console.log('call to /receive');
  if (req.body.type === 'lightning') {
    // include comment & amount for real req ..
    res.send(JSON.stringify({ address: 'lntb1u1pwz5w78pp5e8w8cr5c30xzws92v3' }));
    return;
  }
  res.send(JSON.stringify({ address: 'bcrt1qxunuhx7ve74n6f7z667qrl7wjachdyyzndwdyz' }));
});

app.post('/send', (req, res) => {
  console.log('call to /send');
  res.status(200).send();
});

app.get('/transactions', (req, res) => {
  // transactions.listTransactions();
  res.status(200).send();
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
