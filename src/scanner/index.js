const browserInstance = require("./browserInstance");
const formWorker = require("./workers/formWorker");
const inputWorker = require("./workers/inputWorker");
const {
  createInitialReport,
  clearScreenshots,
  closeReport,
  getJsonReport,
} = require("./workers/reportWorker");

function beforeScanning(url) {
  createInitialReport(url);
  clearScreenshots();
  console.log("\x1b[36m%s\x1b[0m", `Start scanning ${url}`);
}
function afterScanning(url, options) {
  closeReport(url);
  if (options.result === "stream") {
    return getJsonReport(url);
  }
  return "";
}

async function scanForms(url, options) {
  beforeScanning(url);
  const { page, browser } = await browserInstance.getPage(url, options);
  try {
    const formElements = await page.$$("form");

    if (!formElements || formElements.length === 0) {
      console.log("\x1b[36m%s\x1b[0m", "No form element detected on that page");
    } else {
      console.log(
        "\x1b[36m%s\x1b[0m",
        `${formElements.length} form(s) detected`
      );
      await formWorker.analyse(url, formElements.length, options);
    }
  } catch (error) {
    //
  } finally {
    await browser.close();
    return afterScanning(url, options);
  }
}
async function scanInputs(url, selectors, options) {
  beforeScanning(url);
  try {
    if (!selectors || !selectors.inputs || selectors.inputs.length === 0) {
      console.log("\x1b[36m%s\x1b[0m", "Please add input selector(s)");
    } else if (!selectors || !selectors.submit || selectors.submit === "") {
      console.log("\x1b[36m%s\x1b[0m", "Please add submit selector");
    } else {
      await inputWorker.testAdvanced(url, selectors, options);
    }
  } catch (error) {
    //
  } finally {
    return afterScanning(url, options);
  }
}
const ssXss = {
  scanForms,
  scanInputs,
};
module.exports = ssXss;
