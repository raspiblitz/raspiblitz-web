const util = require('./util');

const btcInfo = () => {
  console.log('sending btc_info');

  util.sendSSE('btc_info', {
    blocks: 25,
    headers: 25,
    verification_progress: 1.0,
    difficulty: 0,
    size_on_disk: 7752,
    networks: [
      { name: 'ipv4', limited: false, reachable: true, proxy: '', proxy_randomize_credentials: false },
      { name: 'ipv6', limited: false, reachable: true, proxy: '', proxy_randomize_credentials: false },
      { name: 'onion', limited: true, reachable: false, proxy: '', proxy_randomize_credentials: false }
    ],
    version: 210100,
    subversion: '/Satoshi:0.21.1/',
    connections_in: 1,
    connections_out: 1
  });
};

module.exports = { btcInfo };
