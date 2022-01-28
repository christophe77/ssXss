const puppeteer = require("puppeteer");
const browserInstance = require("./browserInstance");
const formWorker = require("./workers/formWorker");
const reportWorker = require("./workers/reportWorker");

async function scan(url, options) {

  reportWorker.createInitialReport(url);
  reportWorker.clearScreenshots();

  const { page, browser } = await browserInstance.getPage(url, options);

  try {
    const formElements = await page.$$("form");

    if (!formElements || formElements.length === 0) {
      throw "No form element detected on that page";
    }
    await formWorker.analyse(url, formElements.length, options);

  } catch (error) {
    console.log(error);
  } finally {
    await browser.close();
  }
}

const ssXss = {
  scan,
};
module.exports = ssXss;
