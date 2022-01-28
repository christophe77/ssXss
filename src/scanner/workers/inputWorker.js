const puppeteer = require("puppeteer");
const { screenshotDebugStoragePath } = require("../utils");
const payloads = require("../payloads");
const browserInstance = require("../browserInstance");
const reportWorker = require("./reportWorker");

async function test(url, selectors, formIndex, options) {
  const { screenDebug, waitForSelectorTimeout } = options;
  for (
    let selectorIndex = 0;
    selectorIndex < selectors.length;
    selectorIndex++
  ) {
    const selector = selectors[selectorIndex];
    const { page, browser } = await browserInstance.getPage(url, options);
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
      const debugScreenshot = async (currentPage, debugName) => {
        if (screenDebug) {
          await currentPage.screenshot({
            path: `${screenshotDebugStoragePath}/${debugName}-${selectorIndex}-${payloadIndex}.png`,
          });
        }
      };
      if (xssFound === false) {
        try {
          xssPayload = payload;
          await debugScreenshot(page, "initial-view");

          const formElements = await page.$$("form");
          const currentForm = formElements[formIndex];
          
          await page.$eval(
            selector,
            (element, value) => (element.value = value),
            payload
          );
          await page.evaluate((form) => form.submit(), currentForm);

          await debugScreenshot(page, "after-click");

          if (payload.includes("onmouseover")) {
            try {
              await page.waitForSelector(selector, {
                timeout: waitForSelectorTimeout,
              });
              await page.hover(selector);
            } catch (error) {
              // Page may have changed after submit
              await debugScreenshot(page, "onmouseover");
            }
          }
        } catch (error) {
          console.log(error);
        } finally {
          await page.goto(url, { waitUntil: "networkidle2" });
          await debugScreenshot(page, "after-reload");
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
