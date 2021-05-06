const WebSocket = require('ws');
const sync = require('./sync');
const bitcoin = require('./bitcoin');
const ln = require('./ln');
const apps = require('./apps');

const port = 8080;

const wss = new WebSocket.Server({ port });

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
    case 'btc_transactions':
      bitcoin.transactions(ws);
      break;
    case 'btc_receive_payment':
      bitcoin.receivePayment(ws);
      break;
    case 'btc_send_payment':
      bitcoin.sendPayment(ws);
      break;
    case 'ln_transactions':
      ln.transactions(ws);
      break;
    case 'app_status':
      apps.appStatus(ws);
      break;
    default:
      ws.send(JSON.stringify({ error: 'id not specified' }));
  }
};

console.log(`Started WebSocket Backend on port ${port}`);
