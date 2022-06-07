const express = require("express");
const router = express.Router();

const auth = require("./auth");

router.post("/login", (req, res) => {
  console.info(`call to ${req.originalUrl}`);
  // setTimeout to simulate some delay
  setTimeout(() => {
    if (req.body.password === process.env.WALLET_PASSWORD) {
      const access_token = auth.signToken();
      res.status(200).send(JSON.stringify({ access_token }));
    } else {
      res.status(401).send();
    }
  }, 100);
});

router.post("/change-password", (req, res) => {
  console.info(`call to ${req.originalUrl}`);
  res.status(200).send();
});

router.post("/refresh-token", (req, res) => {
  console.info(`call to ${req.originalUrl}`);
  if (!req.headers.authorization) {
    return res.status(401).send(
      JSON.stringify({
        detail: "Not authenticated",
      })
    );
  }
  const access_token = auth.signToken();
  res.status(200).send(JSON.stringify({ access_token }));
});

router.post("/reboot", (req, res) => {
  console.info(`call to ${req.originalUrl}`);
  res.status(200).send();
});

router.post("/shutdown", (req, res) => {
  console.info(`call to ${req.originalUrl}`);
  res.status(200).send();
});

module.exports = router;
