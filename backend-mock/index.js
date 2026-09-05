const express = require("express");
const { attachRealtimeServer } = require("./realtime");
const cors = require("cors");
const setup = require("./setup");
const system = require("./system");
const apps = require("./apps");
const lightning = require("./lightning");

require("dotenv").config();

const app = express();
app.use(
  cors({ credentials: true, origin: "http://localhost:3000" }),
  express.json(),
);
app.get("/index.html", (req, res) => {
  // only to satisfy playwright webserver check
  res.send("ok");
});
app.use("/api/system", system);
app.use("/api/setup", setup);
app.use("/api/apps", apps);
app.use("/api/lightning", lightning);

const PORT = 8000;

const server = app.listen(PORT, () => {
  console.info(`Server listening on http://localhost:${PORT}`);
});

// app.use('/', express.static('../build'));

attachRealtimeServer(server);
