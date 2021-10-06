const util = require('./util');

const systemInfo = () => {
  console.log('sending system_info');

  util.sendSSE('system_info', {
    "alias": "dave",
    "color": "#3399ff",
    "version": "v1.8.0",
    "health": "attention_required",
    "health_messages": [{ "id": 25, "level": "warning", "message": "HDD 85% full" }],
    "tor_web_ui": "arg6ybal4b7dszmsncsrudcpdfkxadzfdi24ktceodah7tgmdopgpyfd.onion",
    "tor_api": "arg6ybal4b7dszmsncsrudcpdfkxadzfdi24ktceodah7tgmdopgpyfd.onion/api",
    "lan_web_ui": "http://192.168.1.12/",
    "lan_api": "http://192.168.1.12/api",
    "ssh_address": "http://192.168.1.12/",
    "chain": "regtest"
  });
};

module.exports = { systemInfo };
