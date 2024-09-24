const util = require("./util");

const systemStartupInfo = (ws) => {
  console.info("sending system_startup_info");

  const data = {
    bitcoin: "done",
    bitcoin_msg: "",
    lightning: "",
    lightning_msg: "Wallet locked, unlock it to enable full RPC access",
  };

  util.sendData(ws, "system_startup_info", data);
};

module.exports = { systemStartupInfo };
