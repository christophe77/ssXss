const express = require("express");
const cors = require("cors");
const path = require("path");
const { forms, inputs, stream } = require("../globals");
const ssXss = require("../scanner");

const options = {
  result: stream,
  screenDebug: false,
  userAgent: "UA-SSXSS",
  navigationTimeout: 5000,
  waitForSelectorTimeout: 3000,
};

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(path.join(`${__dirname}/public/index.html`));
});
app.use(express.static(`${__dirname}/public`));

app.post("/scan-forms", async (req, res) => {
  const { urlToScan } = req.body;
  const scanOptions = { ...options, scanType: forms };
  const results = await ssXss.scanForms(urlToScan, scanOptions);
  res.send(results);
});
app.post("/scan-inputs", async (req, res) => {
  const { urlToScan, selectors } = req.body;
  const scanOptions = { ...options, scanType: inputs };
  const results = await ssXss.scanInputs(urlToScan, selectors, scanOptions);
  res.send(results);
});

app.listen(6969, () => {
  console.log("web server listening on port 6969");
});
