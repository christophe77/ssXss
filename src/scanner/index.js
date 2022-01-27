const puppeteer = require("puppeteer");
const formWorker = require("./formWorker");
const reportMaker = require("./reportMaker");

async function scan(url) {
  reportMaker.createInitialReport(url);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(5000);
  await page.setUserAgent("UA-NODE-XSS-SCANNER");
  await page.goto(url, { waitUntil: "networkidle2" });

  try {
    const formElements = await page.$$("form");

    if (!formElements || formElements.length === 0) {
      throw "No form element detected on that page";
    }
    await formWorker.analyse(url, formElements.length);
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
