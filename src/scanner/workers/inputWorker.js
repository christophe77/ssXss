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
    const selector = selectors[selectorIndex];
    const { page, browser } = await browserInstance.getPage(url);
    let xssFound = false;
    let xssPayload = "";
    page.on("console", async (_console) => {
      if (_console.text().includes("ssxss")) {
        xssFound = true;
        reportWorker.saveToJson(url, selector, xssPayload);
      }
    });
    page.on("dialog", async (_dialog) => {
      if (_dialog.message().includes("ssxss")) {
        xssFound = true;
        reportWorker.saveToJson(url, selector, xssPayload);
        _dialog.accept();
      }
    });

    for (let payloadIndex = 0; payloadIndex < payloads.length; payloadIndex++) {
      const payload = payloads[payloadIndex];

      if (xssFound === false) {
        try {
          xssPayload = payload;
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
          //
        } finally {
          //
        }
      }
    }

    await browser.close();
  }
}
const inputWorker = {
  test,
};
module.exports = inputWorker;
