const express = require("express");
const router = express.Router();
const transactions = require("./transactions");
const util = require("./sse/util");

let WALLET_LOCKED = true;

router.post("/add-invoice", (req, res) => {
  console.info(
    `call to /api/v1/lightning/add-invoice with value ${req.query.value_msat} and memo ${req.query.memo}`
  );
  res.send(
    // LND invoice
    JSON.stringify({
      payment_request:
        "lnbcrt500u1p3vza0ppp5nyyutzvav66suf7070wxje3ys7mrx44283l6u82cywjrc0ylunhsdqqcqzpgxqyz5vqsp5j5wdagc9nwxsqu9z2r562nznwqlgw760tr8nkx7ty3ahrks73lgq9qyyssqjf0r2apc84cvcyrp4w3rt3ymm44hl2kveavjsmjee9xdc35s8a6j3zyzqckkpyehgxpvuyqe4q9r5uejaqysg6vslr2wdt82wg4jm7cqp3xxp9",
    })
    // CLN invoice
    // JSON.stringify({
    //   payment_request:
    //     "lnbcrt500u1p3vzavmsp5pmsj2spnr2lnwc2zsvk34aknjgdgx4gvh2ysmhtla2z97vtdanhspp5kkgdwd64vtrc357f37k83y3cse3e78z6nnxsw52r7gl5dut8grzsdp92phkcctjypykuan0d93k2grxdaezqcmpwfhkcxqyjw5qcqp29qyysgq23lvlur06f7ltsct9tl8pjaezztpmm8z4hmq03nh7yscanww60zravptucv8l7ekeefp80050c8rwrywty932l0wtyke5dn0shzlg5gpxctemt",
    // })
  );
});

router.post("/send-coins", (req, res) => {
  console.info(`call to ${req.originalUrl}`);
  res.status(200).send({
    txid: "txid",
    address: "11234",
    amount: 120202,
    label: "someLabel",
  });
});

router.get("/decode-pay-req", (req, res) => {
  console.info(
    "call to /api/v1/lightning/decode-pay-req with invoice",
    req.query["pay_req"]
  );

  setTimeout(() => {
    // LND invoice
    return res.status(200).send(
      JSON.stringify({
        destination:
          "03fd5eeea1e7ef8bf25124e5bb0f4546e1dd28ce09d6c0d5136f417d74e8afb270",
        payment_hash:
          "9909c5899d66b50e27cff3dc69662487b63356aa3c7fae1d5823a43c3c9fe4ef",
        num_satoshis: 50000,
        timestamp: 1656845793,
        expiry: 86400,
        description: "",
        description_hash: "",
        fallback_addr: "",
        cltv_expiry: 40,
        route_hints: [],
        payment_addr:
          "951cdea3059b8d0070a250e9a54c53703e877b4f58cf3b1bcb247b71da1e8fd0",
        num_msat: 50000000,
        features: [
          {
            key: 14,
            value: {
              name: "payment-addr",
              is_required: true,
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
            key: 17,
            value: {
              name: "multi-path-payments",
              is_required: false,
              is_known: true,
            },
          },
        ],
        currency: "",
      })
    );
  }, 1500);

  // CLN invoice
  // return res.status(200).send(JSON.stringify({
  //   "destination": "0221861fdbe92325c98bf90c61b68b8419ba825d6b8901eb46fa1c5f9fc7ec7eee",
  //   "payment_hash": "b590d7375562c788d3c98fac78923886639f1c5a9ccd075143f23f46f16740c5",
  //   "num_satoshis": 50000,
  //   "timestamp": 1656845723,
  //   "expiry": 604800,
  //   "description": "Polar Invoice for carol",
  //   "description_hash": "",
  //   "fallback_addr": "",
  //   "cltv_expiry": 10,
  //   "route_hints": [],
  //   "payment_addr": "0ee12540331abf376142832d1af6d3921a83550cba890ddd7fea845f316decef",
  //   "num_msat": 50000000,
  //   "features": [
  //     {
  //       "key": 14,
  //       "value": {
  //         "name": "payment-addr",
  //         "is_required": true,
  //         "is_known": true
  //       }
  //     },
  //     {
  //       "key": 17,
  //       "value": {
  //         "name": "multi-path-payments",
  //         "is_required": false,
  //         "is_known": true
  //       }
  //     },
  //     {
  //       "key": 8,
  //       "value": {
  //         "name": "tlv-onion",
  //         "is_required": true,
  //         "is_known": true
  //       }
  //     }
  //   ],
  //   "currency": ""
  // }));
});

router.post("/send-payment", (req, res) => {
  console.info(
    `call to ${req.originalUrl} with invoice ${req.query["pay_req"]}`
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

router.get("/list-all-tx", (req, res) => {
  console.info(`call to ${req.originalUrl}`);
  if (WALLET_LOCKED) {
    return res.status(423).send();
  }
  return res.status(200).send(JSON.stringify(transactions.listTransactions()));
});

router.post("/new-address", (req, res) => {
  console.info(
    `call to /api/v1/lightning/new-address with type ${req.body.type}`
  );
  return res.status(200).send("bcrt1qvh74klc36lefsdgq5r2d44vwxxzkdsch0hhyrz");
});

router.post("/unlock-wallet", (req, res) => {
  console.info(
    `call to /api/v1/lightning/unlock-wallet with type ${req.body.password}`
  );
  // simulate loading time
  setTimeout(() => {
    if (req.body.password === "password") {
      WALLET_LOCKED = false;
      setTimeout(() => {
        util.sendSSE("system_startup_info", {
          bitcoin: "done",
          bitcoin_msg: "",
          lightning: "done",
          lightning_msg: "",
        });
      }, 3000);
      return res.status(200).send(true);
    }
    return res.status(401).send();
  }, 1000);
});

router.post("/open-channel", (req, res) => {
  console.info(`call to ${req.originalUrl}`);
  return res.status(200).send();
});

router.get("/list-channels", (req, res) => {
  console.info(`call to ${req.originalUrl}`);
  return res.send(
    JSON.stringify([
      {
        channel_id: "bla",
        active: true,
        peer_publickey: "sndsdnsknwwn",
        peer_alias: "MY_NICE_CHANNEL",
        balance_local: 1_000_000,
        balance_remote: 5_000_000,
        balance_capacity: 6_000_000,
      },
      {
        channel_id: "id2",
        active: true,
        peer_publickey: "myPubKey",
        peer_alias: "MY PEER ALIAS",
        balance_local: 100_000_000,
        balance_remote: 200_000_000,
        balance_capacity: 300_000_000,
      },
    ])
  );
});

router.post("/close-channel", (req, res) => {
  console.info(`call to ${req.originalUrl}`);
  return res.status(200).send();
});

module.exports = router;
