const express = require("express");
const fs = require("node:fs");
const router = express.Router();
require("dotenv").config();

const auth = require("./auth");

router.post("/login", (req, res) => {
  console.info(`call to ${req.originalUrl}`);
  // setTimeout to simulate some delay
  setTimeout(() => {
    if (req.body.password === process.env.WALLET_PASSWORD) {
      const access_token = auth.signToken();
      res.status(200).send(access_token);
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
        detail: "Not authenticated"
      })
    );
  }
  const access_token = auth.signToken();
  res.status(200).send(access_token);
});

router.post("/reboot", (req, res) => {
  console.info(`call to ${req.originalUrl}`);
  setTimeout(() => {
    res.status(200).send();
  }, 2000);
});

router.post("/shutdown", (req, res) => {
  console.info(`call to ${req.originalUrl}`);
  setTimeout(() => {
    res.status(200).send();
  }, 2000);
});

router.get("/get-debug-logs-raw", (req, res) => {
  console.info(`call to ${req.originalUrl}`);
  const logs = fs.readFileSync("debuglog.txt", { encoding: "utf-8" });
  res.status(200).send(logs);
});

router.get("/connection-info", (req, res) => {
  console.info(`call to ${req.originalUrl}`);
  const lndInfo = {
    lnd_admin_macaroon:
      "0201036C6E6402F801030A10B9BC5746E0F52F441BE2BF3B75A1C1EC1201301A160A0761646472657373120472656164120577726974651A130A04696E666F120472656164120577726974651A170A08696E766F69636573120472656164120577726974651A210A086D616361726F6FD634804926E441E8C730F92AE0C10E5732EE20EB6D6DE",
    lnd_invoice_macaroon:
      "0201036C6E640258030A10B7BC5746E0F52F441BE2BF3B75A1C1EC1201301A160A0761646472657373120472656164120577726974651A170A08696E766F6963657312047",
    lnd_readonly_macaroon:
      "0201036C6E6402AC01030A10B8BC5746E0F52F441BE2BF3B75A1C1EC1201301A0F0A07616464726573731204726561641A0C0A04696E666F1204726561641A100A08696E766F696365731204726561641A100A086D616361726F6F6E1204726561641A0F0A076D6573736167651204726561641A100A086F6666636861696E1204726561641A0F0A076F6E636861696E1204726561641A0D0A0570656572731204726561641A0E0A067369676E65721204726561640000062065950AD6F3E7C234B5E76B9EC58838180AB9296F99D49F9C0396C9138",
    lnd_rest_onion:
      "7hyube57cxcd47lcgrihujaevtsqlgd5ga34l637rgsyvd32x6.onion:8080",
    lnd_tls_cert:
      "2D2D2D2D2D424547494E2043455254494649434154452D2D2D2D2D0A4D494943436A434341624367417749424167495156505242734D556F4D37443532634574762B6671696A414B42676771686B6A4F50515144416A41314D5238770A485159445651514B45785A73626D5167595856306232646C626D56795958526C5A43426A5A584A304D52497745415944565151444760A633351774868634E4D6A45774F4449334D546B304D7A51775768634E4D6A49784D4449794D546B304D7A5177576A41314D523877485159445651514B45785A730A626D5167595856306232646C626D56795958526C5A43426A5A584A304D524977454159445651514445776C7362324E68624768766333517757544154426763710A686B6A4F5051494242676771686B6A4F50514D4242774E434141512B4A42564C363634484C58346F4F78482F534C705A61584E4E474F775657496E44373058310A4745426F425341492F3177372B354D635855694F6E554552793041524641304E366D354E4B666B502B346130586E79566F3447684D4947654D413447413155640A447745422F775145417749437044415442674E56485355454444414B4267677242674546425163444154415042674E5648524D4241663845425441444151482F0A4D42304741315564446751574242513946686E4B31517256705670344E68746A4A66323567584262687A424842674E56485245455144412B67676C7362324E680A62476876633353434248567561586943436E56756158687759574E725A56D364842483841414147484541414141414141414141410A414141414141414141414577436759494B6F5A497A6A3045417749445341417752514968414A726D33786478504C737444382F466B61554A68534846375375740A7A2B344776524A512F637A4876326836416941383677627747782F4C624A5074716342476E773639626C73507A6646496F2F3072434F636C4F754F5248773D3D0A2D2D2D2D2D454E44204345525449464943415445",
    lnd_btcpay_connection_string: "",
    lnd_zeus_connection_string:
      "lndconnect://7hyube57cxcd47lcgrihujaevtsqlgd5ga34l637rgsyvd32x6.onion:8080?macaroon=AgEDbG5kAvgBAwoQubxXRuD1L0Qb4r87daHB7BIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaIQoIbWFjYXJvb24SCGdlbmVyYXRlEgRyZWFkEgV3cml0ZRoWCgdtZXNzYWdlEgRyZWFkEgV3cml0ZRoXCghvZmZjaGFgoHb25jaGFpbhIEcmVhZBIFd3JpdGUaFAoFcGVlcnMSBHJlYWQSBXdyaXRlGhgKBnNpZ25lchIIZ2VuZXJhdGUSBHJlYWQAAAYg0JENEUVinuZ2_WNIBJJuRB6Mcw-SrgwQ5XMu4g621t4&cert=MIICCjCCAbCgAwIBAgIQVPRBsMUoM7D52cEtv-fqijAKBggqhkjOPQQDAjA1MR8wHQYDVQQKExZsbmQgYXV0b2dlbmVyYXRlZCBjZXJ0MRIwEAYDVQQDEwlsb2NhbGhvc3QwHhcNMjEwODI3MTk0MzQwWhcNMjIxMDIyMTk0MzQwWjA1MR8wHQYDVQQKExZsbmQgYXV0b2dlbmVyYXRlZCBjZXJ0MRIwEAYDVQQDEwlsb2NhbGhvc3QwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAAQ-JBVL664HLX4oOxH_SLpZaXD70X1GEBoBSAI_1w7-5McXUiOnUERy0ARFA0N6m5NKfkP-4a0XnyVo4GhMIGeMwICpDATBgNVHSUEDDAKBggrBgEFBQcDATAPBgNVHRMBAf8EBTADAQH_MB0GA1UdDgQWBBQ9FhnK1QrVpVp4NhtjJf25gXBbhzBHBgNVHREEQDA-gglsb2NhbGhvc3SCBHVuaXiCCnVuaXhwYWNrZXSCB2J1ZmNvbm6HBH8AAAGHEAAAAAAAAAAAAAAAAAAAAAEwCgYIKoZIzj0EAwIDSAAwRQIhAJrm3xdxPLstD8_FkaUJhSHF7Sutz-4GvRJQ_czHv2h6AiA86wbwGx_LbJPtqcBGnw69blsPzfFIo",
    cl_rest_zeus_connection_string: "",
    cl_rest_macaroon: "",
    cl_rest_onion: ""
  };
  res.status(200).send(lndInfo);
});

module.exports = router;
