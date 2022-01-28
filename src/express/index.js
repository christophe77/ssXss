const express = require('express');
const cors = require('cors');
const path = require('path');
const ssXss = require('../scanner');

const options = {
  screenDebug: false,
  express: true,
  userAgent: 'UA-SSXSS',
  navigationTimeout: 5000,
  waitForSelectorTimeout: 3000,
};

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/public/index.html`));
});
app.use(express.static(`${__dirname}/public`));

app.post('/scan', async (req, res) => {
  const { urlToScan } = req.body;
  const results = await ssXss.scan(urlToScan, options);
  res.send(results);
});

app.listen(6969, () => {
  console.log('web server listening on port 6969');
});
