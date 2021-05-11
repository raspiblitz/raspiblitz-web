const WebSocket = require('ws');
const sync = require('./sync');
const transactions = require('./transactions');
const apps = require('./apps');
const cors = require('cors');
const express = require('express');

const wsPort = 8080;
const restPort = 8081;

const app = express();
app.use(cors());

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

app.get('/receive', (req, res) => {
  res.send({ address: 'bcrt1qxunuhx7ve74n6f7z667qrl7wjachdyyzndwdyz' });
});

app.post('/send', (req, res) => {
  res.send('success');
});
