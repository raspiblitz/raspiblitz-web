const util = require("./util");

const walletBalance = () => {
  console.info("sending wallet_balance");

  util.sendSSE("wallet_balance", {
    onchain_confirmed_balance: 742363,
    onchain_total_balance: 742363,
    onchain_unconfirmed_balance: 200000000,
    // all channel balances are in mSat => to get sat: mSat / 1000
    channel_local_balance: 140950000,
    channel_remote_balance: 100000000,
    channel_unsettled_local_balance: 0,
    channel_unsettled_remote_balance: 0,
    channel_pending_open_local_balance: 0,
    channel_pending_open_remote_balance: 0,
  });
};

module.exports = { walletBalance };
