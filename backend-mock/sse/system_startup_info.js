const util = require('./util');

const systemStartupInfo = () => {
  console.info('sending system_startup_info');

  util.sendSSE('system_startup_info', {
    bitcoin: 'done',
    bitcoin_msg: '',
    lightning: 'locked',
    lightning_msg: 'Wallet locked, unlock it to enable full RPC access',
  });
};

module.exports = { systemStartupInfo };
