const util = require('./util');

const lnStatus = () => {
  console.log('sending ln_status');

  util.sendSSE('ln_status', {
    implementation: 'LND',
    version: '0.13.0-beta commit=v0.13.0-beta',
    num_pending_channels: 0,
    num_active_channels: 0,
    num_inactive_channels: 0,
    block_height: 125,
    synced_to_chain: true,
    synced_to_graph: true
  });
};

module.exports = { lnStatus };
