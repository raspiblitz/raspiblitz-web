const util = require("./util");
const { createAppStateUpdateMessage } = require("../shared-data");

const appStatus = (send = util.sendEvent) => {
  console.info("sending app_state_update_message");
  send("app_state_update_message", createAppStateUpdateMessage());
};

module.exports = { appStatus };
