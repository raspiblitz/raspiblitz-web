const util = require('./util');

const walletBalance = () => {
  console.log('sending wallet_balance');

  util.sendSSE('wallet_balance', {
    onchain_confirmed_balance: 742363,
    onchain_total_balance: 742363,
    onchain_unconfirmed_balance: 0,
    channel_local_balance: 40950,
    channel_remote_balance: 100000,
    channel_unsettled_local_balance: 0,
    channel_unsettled_remote_balance: 0,
    channel_pending_open_local_balance: 0,
    channel_pending_open_remote_balance: 0
  });
};

module.exports = { walletBalance };
