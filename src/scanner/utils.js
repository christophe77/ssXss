const path = require('path');

const screenshotDebugStoragePath = path.join(
  process.cwd(),
  '/src/debug-screenshots'
);
const resultsPath = path.join(process.cwd(), '/src/results');

const utils = {
  screenshotDebugStoragePath,
  resultsPath,
};

module.exports = utils;
