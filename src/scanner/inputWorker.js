const puppeteer = require("puppeteer");
const payloads = require("./payloads");
const reportMaker = require("./reportMaker");

async function test(url, selectors, formIndex) {
    for (
      let selectorIndex = 0;
      selectorIndex < selectors.length;
      selectorIndex++
    ) {
      for (let payloadIndex = 0; payloadIndex < payloads.length; payloadIndex++) {
        const payload = payloads[payloadIndex];
        const selector = selectors[selectorIndex];
        const browserInstance = await puppeteer.launch();
        const page = await browserInstance.newPage();
  
        page.on("console", async (_console) => {
          if (_console.text().includes("ssxss")) {
            reportMaker.saveToJson(url, selector, payload);
          }
        });
  
        await page.setDefaultNavigationTimeout(5000);
        await page.setUserAgent("UA-NODE-XSS-SCANNER");
        await page.goto(url, { waitUntil: "networkidle2" });
  
        try {
          const formElements = await page.$$("form");
          const currentForm = formElements[formIndex];
          await page.$eval(
            selector,
            (element, value) => (element.value = value),
            payload
          );
          await page.evaluate((form) => form.submit(), currentForm);
          await page.waitForSelector(selector, { timeout: 5000 });
  
          if (payload.includes("onmouseover")) {
            await page.hover(selector);
          }
        } catch (error) {
          console.log(error);
        } finally {
          await browserInstance.close();
        }
      }
    }
  }
  const inputWorker = {
    test,
  };
  module.exports = inputWorker;