const util = require("./util");
const fs = require("fs");

const installApp = () => {
  console.info("call to installApp");
  util.sendSSE("apps", [
    {
      id: "btc-pay",
      name: "BTCPay Server",
      description:
        "Accept Bitcoin payments. Free, open-source & self-hosted, Bitcoin payment processor",
      installed: true,
      address: "https://192.168.0.599:4081/",
      hiddenService: "blablablabla.onion",
    },
  ]);
  // inform Frontend that no apps are currently installing
  util.sendSSE("install", { id: null });
};

const appDetails = (req) => {
  const img1 =
    "data:image/png;base64," +
    Buffer.from(fs.readFileSync("images/btc-rpc-1.png"), "binary").toString(
      "base64"
    );
  const img2 =
    "data:image/png;base64," +
    Buffer.from(fs.readFileSync("images/btc-rpc-2.png"), "binary").toString(
      "base64"
    );
  const img3 =
    "data:image/png;base64," +
    Buffer.from(fs.readFileSync("images/btc-rpc-3.png"), "binary").toString(
      "base64"
    );
  const details = {
    id: req.params.id,
    name: "BTC RPC Explorer",
    author: "Dan Janosik",
    description: getDescription(),
    repository: "https://github.com/janoside/btc-rpc-explorer",
    version: "1.2.3",
    images: [img1, img2, img3],
    installed: true,
  };
  return details;
};

module.exports = { installApp, appDetails };

const getDescription = () => {
  return "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";
};
