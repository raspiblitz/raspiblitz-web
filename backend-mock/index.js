const express = require('express');
const cors = require('cors');
const btcInfo = require('./sse/btc_info');
const lnInfo = require('./sse/ln_info');
const installedAppStatus = require('./sse/installed_app_status');
const systemInfo = require('./sse/system_info');
const hardwareInfo = require('./sse/hardware_info');
const walletBalance = require('./sse/wallet_balance');
const systemStartupInfo = require('./sse/system_startup_info');
const util = require('./sse/util');
const setup = require('./setup');
const system = require('./system');
const apps = require('./apps');
const lightning = require('./lightning');

require('dotenv').config();

const app = express();
app.use(
  cors({ credentials: true, origin: 'http://localhost:3000' }),
  express.json(),
);
app.get('/index.html', (req, res) => {
  // only to satisfy playwright webserver check
  res.send('ok');
});
app.use('/api/system', system);
app.use('/api/setup', setup);
app.use('/api/apps', apps);
app.use('/api/lightning', lightning);

const PORT = 8000;

app.listen(PORT, () => {
  console.info(`Server listening on http://localhost:${PORT}`);
});

// app.use('/', express.static('../build'));

/**
 * Main SSE Handler
 */
const eventsHandler = (request, response) => {
  console.info('call to /api/sse/subscribe');
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
  };
  response.writeHead(200, headers);

  const data = `data: null\n\n`;

  response.write(data);

  const id = util.currClientId++;

  util.clients.push({
    id,
    response,
  });

  systemStartupInfo.systemStartupInfo();
  systemInfo.systemInfo();
  hardwareInfo.hardwareInfo();
  btcInfo.btcInfo();
  lnInfo.lnInfo();
  installedAppStatus.appStatus();
  walletBalance.walletBalance();

  request.on('close', () => {
    // do nothing
  });
};

/**
 * SSE Handler call
 */
app.get('/api/sse/subscribe', eventsHandler);
