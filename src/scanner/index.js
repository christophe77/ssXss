const puppeteer = require("puppeteer");
const browserInstance = require("./browserInstance");
const formWorker = require("./workers/formWorker");
const {
  createInitialReport,
  clearScreenshots,
  closeReport,
} = require("./workers/reportWorker");

async function scan(url, options) {
  createInitialReport(url);
  clearScreenshots();

  const { page, browser } = await browserInstance.getPage(url, options);
  console.log("\x1b[36m%s\x1b[0m", `Start scanning ${url}`);
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
    console.log(error);
  } finally {
    await browser.close();
    closeReport(url);
  }
}

const ssXss = {
  scan,
};
module.exports = ssXss;
