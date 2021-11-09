const util = require("./util");

const lnInfoLite = () => {
  console.info("sending ln_info_lite");

  util.sendSSE("ln_info_lite", {
    implementation: "LND",
    version: "0.13.0-beta commit=v0.13.0-beta",
    num_pending_channels: 1,
    num_active_channels: 3,
    num_inactive_channels: 2,
    block_height: 125,
    synced_to_chain: true,
    synced_to_graph: true,
  });
};

module.exports = { lnInfoLite };
