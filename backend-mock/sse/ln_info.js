const util = require("./util");

const lnInfo = () => {
  console.info("sending ln_info");

  util.sendSSE("ln_info", {
    implementation: "LND_GRPC",
    version: "0.17.3-beta commit=v0.17.3-beta",
    commit_hash: "13aa7f99248c7ee63989d3b62e0cbfe86d7b0964",
    identity_pubkey:
      "03968caa15a360137c31a8ff4573608c44cbee4fe592175321b62386334a3ca0da",
    identity_uri:
      "03968caa15a360137c31a8ff4573608c44cbee4fe592175321b62386334a3ca0da@gsfixgvo5zhw6uprdyfvpqijuzod3nfxfhj5ivxf7mdox7zrg3cwdoyd.onion:9735",
    alias: "TestMePls",
    color: "#68f442",
    num_pending_channels: 0,
    num_active_channels: 1,
    num_inactive_channels: 0,
    num_peers: 4,
    block_height: 825606,
    block_hash:
      "0000000000000000000072071f7d12f61e0489e1d62fe3686be5a7cd784c2ca5",
    best_header_timestamp: 1705138071,
    synced_to_chain: true,
    synced_to_graph: true,
    chains: [
      {
        chain: "bitcoin",
        network: "mainnet",
      },
    ],
    uris: ["03968caa15a360137c31.onion:9735"],
    features: [
      {
        key: 45,
        value: {
          name: "explicit-commitment-type",
          is_required: false,
          is_known: true,
        },
      },
      {
        key: 9,
        value: {
          name: "tlv-onion",
          is_required: false,
          is_known: true,
        },
      },
      {
        key: 14,
        value: {
          name: "payment-addr",
          is_required: true,
          is_known: true,
        },
      },
      {
        key: 12,
        value: {
          name: "static-remote-key",
          is_required: true,
          is_known: true,
        },
      },
      {
        key: 17,
        value: {
          name: "multi-path-payments",
          is_required: false,
          is_known: true,
        },
      },
      {
        key: 0,
        value: {
          name: "data-loss-protect",
          is_required: true,
          is_known: true,
        },
      },
      {
        key: 7,
        value: {
          name: "gossip-queries",
          is_required: false,
          is_known: true,
        },
      },
      {
        key: 23,
        value: {
          name: "anchors-zero-fee-htlc-tx",
          is_required: false,
          is_known: true,
        },
      },
      {
        key: 27,
        value: {
          name: "shutdown-any-segwit",
          is_required: false,
          is_known: true,
        },
      },
      {
        key: 30,
        value: {
          name: "amp",
          is_required: true,
          is_known: true,
        },
      },
      {
        key: 31,
        value: {
          name: "amp",
          is_required: false,
          is_known: true,
        },
      },
      {
        key: 2023,
        value: {
          name: "script-enforced-lease",
          is_required: false,
          is_known: true,
        },
      },
      {
        key: 5,
        value: {
          name: "upfront-shutdown-script",
          is_required: false,
          is_known: true,
        },
      },
    ],
  });
};

module.exports = { lnInfo };
