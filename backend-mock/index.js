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
