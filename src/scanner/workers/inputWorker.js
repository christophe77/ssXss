const puppeteer = require("puppeteer");
const payloads = require("../payloads");
const browserInstance = require("../browserInstance");
const reportWorker = require("./reportWorker");

async function test(url, selectors, formIndex) {
  for (
    let selectorIndex = 0;
    selectorIndex < selectors.length;
    selectorIndex++
  ) {
    for (let payloadIndex = 0; payloadIndex < payloads.length; payloadIndex++) {
      const payload = payloads[payloadIndex];
      const selector = selectors[selectorIndex];
      const { page, browser } = await browserInstance.getPage(url);

      page.on("console", async (_console) => {
        if (_console.text().includes("ssxss")) {
          reportWorker.saveToJson(url, selector, payload);
        }
      });

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
        throw error;
      } finally {
        await browser.close();
      }
    }
  }
}
const inputWorker = {
  test,
};
module.exports = inputWorker;
