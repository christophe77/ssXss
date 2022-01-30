const { screenshotDebugStoragePath } = require('../utils');
const payloads = require('../payloads');
const browserInstance = require('../browserInstance');
const reportWorker = require('./reportWorker');

async function test(url, selectors, formIndex, options) {
  const { screenDebug, waitForSelectorTimeout } = options;
  for (
    let selectorIndex = 0;
    selectorIndex < selectors.length;
    selectorIndex += 1
  ) {
    const selector = selectors[selectorIndex];
    const { page, browser } = await browserInstance.getPage(url, options);
    let xssFound = false;
    let xssPayload = '';
    page.on('console', async (_console) => {
      if (_console.text().includes('ssxss')) {
        xssFound = true;
        reportWorker.saveToJson(url, selector, xssPayload);
        console.log('\x1b[32m', `xss found on ${selector} with ${xssPayload}`);
      }
    });
    page.on('dialog', async (_dialog) => {
      if (_dialog.message().includes('ssxss')) {
        xssFound = true;
        reportWorker.saveToJson(url, selector, xssPayload);
        _dialog.accept();
        console.log('\x1b[32m', `xss found on ${selector} with ${xssPayload}`);
      }
    });

    for (
      let payloadIndex = 0;
      payloadIndex < payloads.length;
      payloadIndex += 1
    ) {
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
          await debugScreenshot(page, 'initial-view');

          const formElements = await page.$$('form');
          const currentForm = formElements[formIndex];

          await page.$eval(
            selector,
            (element, value) => {
              element.value = value;
            },
            payload
          );

          // Ugly part to find the submit type
          try {
            await page.evaluate(
              (document) =>
                document.querySelector('input[type=submit]').click(),
              currentForm
            );
          } catch {
            try {
              await page.evaluate(
                (document) =>
                  document.querySelector('button[type=submit]').click(),
                currentForm
              );
            } catch {
              try {
                await page.evaluate((form) => form.submit(), currentForm);
              } catch (error) {
                // console.log(error);
              }
            }
          }

          await debugScreenshot(page, 'after-click');

          await page.waitForNavigation({
            timeout: waitForSelectorTimeout,
          });

          if (payload.includes('onmouseover')) {
            try {
              await page.waitForSelector(selector, {
                timeout: waitForSelectorTimeout,
              });
              await page.hover(selector);
            } catch {
              // Page may have changed after submit
              await debugScreenshot(page, 'error-onmouseover');
            }
          }
        } catch (error) {
          // console.log(error);
          await debugScreenshot(page, 'error-evaluate-form');
        } finally {
          await page.goto(url, { waitUntil: 'networkidle2' });
          await debugScreenshot(page, 'after-reload');
        }
      }
    }

    await browser.close();
  }
}
async function testAdvanced(url, selectors, options) {
  const { screenDebug, waitForSelectorTimeout } = options;
  for (
    let selectorIndex = 0;
    selectorIndex < selectors.inputs.length;
    selectorIndex += 1
  ) {
    const selector = selectors.inputs[selectorIndex];
    const { page, browser } = await browserInstance.getPage(url, options);
    let xssFound = false;
    let xssPayload = '';
    page.on('console', async (_console) => {
      if (_console.text().includes('ssxss')) {
        xssFound = true;
        reportWorker.saveToJson(url, selector, xssPayload);
        console.log('\x1b[32m', `xss found on ${selector} with ${xssPayload}`);
      }
    });
    page.on('dialog', async (_dialog) => {
      if (_dialog.message().includes('ssxss')) {
        xssFound = true;
        reportWorker.saveToJson(url, selector, xssPayload);
        _dialog.accept();
        console.log('\x1b[32m', `xss found on ${selector} with ${xssPayload}`);
      }
    });

    for (
      let payloadIndex = 0;
      payloadIndex < payloads.length;
      payloadIndex += 1
    ) {
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
          await debugScreenshot(page, 'initial-view');
          await page.$eval(
            selector,
            (element, value) => {
              element.value = value;
            },
            payload
          );

          await page.waitForSelector(selectors.submit);
          await page.click(selectors.submit);

          await debugScreenshot(page, 'after-click');

          await page.waitForNavigation({
            timeout: waitForSelectorTimeout,
          });

          if (payload.includes('onmouseover')) {
            try {
              await page.waitForSelector(selector, {
                timeout: waitForSelectorTimeout,
              });
              await page.hover(selector);
            } catch {
              // Page may have changed after submit
              await debugScreenshot(page, 'error-onmouseover');
            }
          }
        } catch (error) {
          // console.log(error);
          await debugScreenshot(page, 'error-evaluate-form');
        } finally {
          await page.goto(url, { waitUntil: 'networkidle2' });
          await debugScreenshot(page, 'after-reload');
        }
      }
    }

    await browser.close();
  }
}
const inputWorker = {
  test,
  testAdvanced,
};
module.exports = inputWorker;
