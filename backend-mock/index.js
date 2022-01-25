const express = require("express");
const cors = require("cors");
const apps = require("./apps");
const btcInfo = require("./btc_info");
const lnInfoLite = require("./ln_info_lite");
const installedAppStatus = require("./installed_app_status");
const systemInfo = require("./system_info");
const auth = require("./auth");
const transactions = require("./transactions");
const walletBalance = require("./wallet_balance");
const util = require("./util");

let walletLocked = true;

const app = express();
app.use(cors(), express.json());

const PORT = 8000;

app.listen(PORT, () => {
  console.info(`Server listening on http://localhost:${PORT}`);
});

// app.use('/', express.static('../build'));

/**
 * Main SSE Handler
 */
const eventsHandler = (request, response) => {
  console.info("call to /api/sse/subscribe");
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  response.writeHead(200, headers);

  const data = `data: null\n\n`;

  response.write(data);

  const id = util.currClientId++;

  util.clients.push({
    id,
    response,
  });

  systemInfo.systemInfo();
  btcInfo.btcInfo();
  lnInfoLite.lnInfoLite();
  installedAppStatus.appStatus();
  walletBalance.walletBalance();

  request.on("close", () => {
    // do nothing
  });
};

/**
 * SSE Handler call
 */
app.get("/sse/subscribe", eventsHandler);

/***
 * STATUS
 * 100 if setup is done, otherwise step in the setup process
 */
app.get("/api/v1/setup/status", (_, res) => {
  console.info("call to /api/v1/setup/status");
  res.send(JSON.stringify({ progress: 100 }));
});

/***
 * AUTH
 */

app.post("/api/v1/system/login", (req, res) => {
  console.info("call to /api/v1/system/login");
  setTimeout(() => {
    if (req.body.password === "password") {
      const access_token = auth.signToken();
      res.status(200).send(JSON.stringify({ access_token }));
    } else {
      res.status(401).send();
    }
  }, 100);
});

app.post("/api/v1/logout", (req, res) => {
  console.info("call to /api/v1/logout");
  res.status(200).send();
});

/***
 * SYNC
 */

// TODO: send back response
app.get("/api/v1/syncstatus", (req, res) => {
  // sync.syncStatus();
  res.status(200).send();
});

/**
 * SETTINGS
 */

app.post("/api/v1/changepw", (req, res) => {
  console.info(
    `call to /api/v1/changepw with old: ${req.body.oldPassword} & new: ${req.body.newPassword}`
  );
  res.send("success");
});

app.post("/api/v1/system/reboot", (req, res) => {
  console.info("call to /api/v1/system/reboot");
  res.status(200).send();
});

app.post("/api/v1/system/shutdown", (req, res) => {
  console.info("call to /api/v1/system/shutdown");
  res.status(200).send();
});

/***
 * APPS
 */

// TODO: send back response
app.get("/api/v1/appstatus", (req, res) => {
  // apps.appStatus();
  res.status(200).send();
});

// TODO: send back response
app.get("/api/v1/apps", (req, res) => {
  // apps.listApps();
  res.status(200).send();
});

app.post("/api/v1/install", (req, res) => {
  console.info("call to /api/v1/install for app", req.body.id);
  // send information that btc-pay is currently installing
  util.sendSSE("install", { id: "btc-pay" });
  setTimeout(() => {
    apps.installApp();
  }, 5000);
  res.status(200).send();
});

app.post("/api/v1/uninstall", (req, res) => {
  console.info("call to /api/v1/uninstall for app", req.body.id);
  // TODO
  res.status(200).send();
});

/***
 * TRANSACTIONS
 */

app.post("/api/v1/lightning/add-invoice", (req, res) => {
  console.info(
    `call to /api/v1/lightning/add-invoice with value ${req.query.value_msat} and memo ${req.query.memo}`
  );
  res.send(
    JSON.stringify({
      payment_request:
        "lnbcrt2u1pseumjxpp5v86496waqjpnt2y6wxa77er2wsrp6afqqmnk3ap0kzjr857vj7ksdqvvdhk6mt9de6qcqzpgxqrrsssp5dvku88d87th4wqmstcl4watfsje0azhk35wtey3vlh59nrr7s2qs9qyyssq3j2l3e3d022vz290j2m5asp7sgud036gfxg2ltm33nm2tcxqz7mntcfd8s3s5v28cna25nmraf75ugsvrflalhamvqrep6fed7amuvcqxnzjpe",
    })
  );
});

app.post("/api/v1/send-coins", (req, res) => {
  console.info("call to /api/v1/send-coins");
  res.status(200).send({
    txid: "txid",
    address: "11234",
    amount: 120202,
    label: "someLabel",
  });
});

app.get("/api/v1/transactions", (req, res) => {
  // transactions.listTransactions();
  res.status(200).send();
});

app.get("/api/v1/tx/:id", (req, res) => {
  console.info("call to /api/v1/tx/" + req.params.id);
  if (req.params.id === "blablabla") {
    res.send(
      JSON.stringify({
        type: "onchain", // or lightning
        hash: "4073686402f35297e6f153bceda0fad51645b35243f21324760c1774f384fdf9",
        confirmations: 2,
        date: 1618501200, // epoch timestamp
        block: 683738, // can be null if not confirmed
        feeRate: 61.9, // sat/vByte
        fee: 0.00158274,
        description: "hi!", // if available
      })
    );
  } else {
    res.send(
      JSON.stringify({
        type: "lightning",
        hash: "1d4443dcad965200d01c0ee34332grfwqwe76j",
        request:
          "LNBC50509VKAVKAVKAVAKVAKVKAVKAVKBLABLABLABLSBLABLSABSLABSALAALBASLSBALBSGSDQ6XGSV89EQGF6KUERVV5S8QCTRDVCQZPGXQRRSSSP538GMWU7BYNZ5FKJG4PDUN2GGMDCJJV9MHJARKDR3CJS9QY9QSQ6UVDP99NYTD",
        status: "SUCCEEDED",
        date: "1618501200", // epoch timestamp
        fee: 2, // (mSats)
        value: 100000, // (mSats) => 100 sat
        description: "hi!", // if available
      })
    );
  }
});

app.get("/api/v1/lightning/decode-pay-req", (req, res) => {
  console.info(
    "call to /api/v1/lightning/decode-pay-req with invoice",
    req.query["pay_req"]
  );

  return res.status(200).send(
    JSON.stringify({
      destination:
        "0323dbd695d801553837f9907100f304abd153932bb000a3a7ea9132ff3e7437a1",
      payment_hash:
        "dc171b0d9a6c33d40ba2d9ed95819b29af40d83132b15072ab4e8b60feb08b90",
      num_satoshis: 20,
      timestamp: 1893456000000,
      expiry: 36000,
      description: "TEST",
      description_hash: "",
      fallback_addr: "",
      cltv_expiry: 40,
      route_hints: [],
      payment_addr:
        "24efc95be534b44b801ea5603b9aa1ad5424196972c7a3357b478e773b55f22e",
      num_msat: 20000,
      features: [
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
          key: 17,
          value: {
            name: "multi-path-payments",
            is_required: false,
            is_known: true,
          },
        },
      ],
    })
  );
});

app.post("/api/v1/lightning/send-payment", (req, res) => {
  console.info(
    "call to /api/v1/lightning/send-payment with invoice",
    req.query["pay_req"]
  );

  return res.status(200).send(
    JSON.stringify({
      payment_hash:
        "b56e1d38dd4b7a04dec7ad87f5ab403bda96a28d4c70dea1d208e8c39b1e8500",
      payment_preimage:
        "df6160dc0f0760c9b3e279a462145fd4e3fef507230c1967a030592f2ae457af",
      value_msat: 1000000,
      payment_request:
        "lnbcrt10u1pscxuktpp5k4hp6wxafdaqfhk84krlt26q80dfdg5df3cdagwjpr5v8xc7s5qqdpz2phkcctjypykuan0d93k2grxdaezqcn0vgxqyjw5qcqp2sp5ndav50eqfh32xxpwd4wa645hevumj7ze5meuajjs40vtgkucdams9qy9qsqc34r4wlyytf68xvt540gz7yq80wsdhyy93dgetv2d2x44dhtg4fysu9k8v0aec8r649tcgtu5s9xths93nuxklvf93px6gnlw2h7u0gq602rww",
      status: "succeeded",
      fee_msat: 0,
      creation_time_ns: 1636004563364389000,
      htlcs: [
        {
          attempt_id: 1000,
          status: "succeeded",
          route: {
            total_time_lock: 178,
            total_fees: 0,
            total_amt: 1000,
            hops: [
              {
                chan_id: 148434069815296,
                chan_capacity: 250000,
                amt_to_forward: 1000,
                fee: 0,
                expiry: 178,
                amt_to_forward_msat: 1000000,
                fee_msat: 0,
                pub_key:
                  "038b6e605d2e2a3f49aed0d3140eb47ae45b011481ef4669f874bdcc2d7baf6d14",
                tlv_payload: true,
              },
            ],
            total_fees_msat: 0,
            total_amt_msat: 1000000,
            mpp_record: null,
            amp_record: null,
            custom_records: [],
          },
          attempt_time_ns: 1636004563379560200,
          resolve_time_ns: 1636004563515875600,
          failure: {
            code: 0,
            channel_update: {
              signature: "",
              chain_hash: "",
              chan_id: 0,
              timestamp: 0,
              message_flags: 0,
              channel_flags: 0,
              time_lock_delta: 0,
              htlc_minimum_msat: 0,
              base_fee: 0,
              fee_rate: 0,
              htlc_maximum_msat: 0,
              extra_opaque_data: "",
            },
            htlc_msat: 0,
            onion_sha_256: "",
            cltv_expiry: 0,
            flags: 0,
            failure_source_index: 0,
            height: 0,
          },
          preimage:
            "df6160dc0f0760c9b3e279a462145fd4e3fef507230c1967a030592f2ae457af",
        },
      ],
      payment_index: 3,
      failure_reason: "FAILURE_REASON_NONE",
    })
  );
});

app.get("/api/v1/lightning/list-all-tx", (req, res) => {
  console.info("call to /api/v1/lightning/list-all-tx");
  if (walletLocked) {
    return res.status(423).send();
  }
  return res.status(200).send(JSON.stringify(transactions.listTransactions()));
});

app.post("/api/v1/lightning/new-address", (req, res) => {
  console.info(
    `call to /api/v1/lightning/new-address with type ${req.body.type}`
  );
  return res.status(200).send("bcrt1qvh74klc36lefsdgq5r2d44vwxxzkdsch0hhyrz");
});

app.post("/api/v1/lightning/unlock-wallet", (req, res) => {
  console.info(
    `call to /api/v1/lightning/unlock-wallet with type ${req.body.password}`
  );
  if (req.body.password === "password") {
    walletLocked = false;
    return res.status(200).send(true);
  }
  return res.status(401).send();
});
