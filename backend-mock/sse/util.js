const util = {
  sendData: (ws, type, data) => {
    ws.send(JSON.stringify({ type, data }));
  },
};

module.exports = util;
