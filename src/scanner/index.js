const browserInstance = require('./browserInstance');
const formWorker = require('./workers/formWorker');
const inputWorker = require('./workers/inputWorker');
const {
  createInitialReport,
  clearScreenshots,
  closeReport,
  getJsonReport,
} = require('./workers/reportWorker');

async function scan(url, options) {
  createInitialReport(url);
  clearScreenshots();

  const { page, browser } = await browserInstance.getPage(url, options);
  console.log('\x1b[36m%s\x1b[0m', `Start scanning ${url}`);
  try {
    const formElements = await page.$$('form');

    if (!formElements || formElements.length === 0) {
      console.log('\x1b[36m%s\x1b[0m', 'No form element detected on that page');
    } else {
      console.log(
        '\x1b[36m%s\x1b[0m',
        `${formElements.length} form(s) detected`
      );
      await formWorker.analyse(url, formElements.length, options);
    }
  } catch (error) {
    //
  } finally {
    await browser.close();
    closeReport(url);
    if (options.express) {
      return getJsonReport(url);
    }
    return '';
  }
}
async function advancedScan(url, selectors, options) {
  createInitialReport(url);
  clearScreenshots();

  console.log('\x1b[36m%s\x1b[0m', `Start scanning ${url}`);
  try {
    if (!selectors || !selectors.inputs || selectors.inputs.length === 0) {
      console.log('\x1b[36m%s\x1b[0m', 'Please add input selector(s)');
    } else if (!selectors || !selectors.submit || selectors.submit === '') {
      console.log('\x1b[36m%s\x1b[0m', 'Please add submit selector');
    } else {
      await inputWorker.testAdvanced(url, selectors, options);
    }
  } catch (error) {
    //
  } finally {
    closeReport(url);
    if (options.express) {
      return getJsonReport(url);
    }
    return '';
  }
}
const ssXss = {
  scan,
  advancedScan,
};
module.exports = ssXss;
