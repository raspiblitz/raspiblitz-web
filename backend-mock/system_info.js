const util = require("./util");

const systemInfo = () => {
  console.info("sending system_info");

  util.sendSSE("system_info", {
    alias: "myBlitz",
    color: "#3399ff",
    version: "v1.8.0",
    tor_web_ui:
      "arg6ybal4b7dszmsncsrudcpdfkxadzfdi24ktceodah7tgmdopgpyfd.onion",
    tor_api:
      "arg6ybal4b7dszmsncsrudcpdfkxadzfdi24ktceodah7tgmdopgpyfd.onion/api",
    lan_web_ui: "http://192.168.1.12",
    lan_api: "http://192.168.1.12/api",
    ssh_address: "192.168.1.12",
    chain: "regtest",
  });
};

module.exports = { systemInfo };
