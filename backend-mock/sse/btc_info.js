const util = require("./util");

const btcInfo = () => {
  console.info("sending btc_info");

  util.sendSSE("btc_info", {
    blocks: 25,
    headers: 25,
    verification_progress: 0.9999983702720613,
    difficulty: 22674148233453.11,
    size_on_disk: 427431959018,
    networks: [
      {
        name: "ipv4",
        limited: false,
        reachable: true,
        proxy: "",
        proxy_randomize_credentials: false,
      },
      {
        name: "ipv6",
        limited: false,
        reachable: true,
        proxy: "",
        proxy_randomize_credentials: false,
      },
      {
        name: "onion",
        limited: true,
        reachable: false,
        proxy: "",
        proxy_randomize_credentials: false,
      },
    ],
    version: 210100,
    subversion: "/Satoshi:0.21.1/",
    connections_in: 16,
    connections_out: 3,
  });
};

module.exports = { btcInfo };
