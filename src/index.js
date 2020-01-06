import "babel-polyfill";
import express from "express";
import forceSsl from "express-force-ssl";
import https from "https";
import http from "http";
import cors from "cors";
// import fs from "fs";
import { getEnv } from "./lib/env";
import createRouter from "./router";
const app = express();
app.use(cors({ origin: "*" }));
const isProduction = getEnv("NODE_ENV") === "production";

if (isProduction) {
  app.use(forceSsl);
}
app.use(createRouter());
console.log(getEnv("NODE_ENV"));
if (isProduction) {
  //   const sslOptions = {
  //     key: fs.readFileSync(getEnv("PRIVKEY_CERT_LOC", true)),
  //     cert: fs.readFileSync(getEnv("FULLCHAIN_CERT_LOC", true))
  //   };
  //   http.createServer(app).listen(80);
  //   https.createServer(sslOptions, app).listen(443);
} else {
  const port = 3000;
  http
    .createServer(app)
    .listen(port, () => console.log(`Listening on port ${port}`));
}
