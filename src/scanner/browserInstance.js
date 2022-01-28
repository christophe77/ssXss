const puppeteer = require('puppeteer');

async function getPage(url, options) {
  const { userAgent, navigationTimeout } = options;
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(navigationTimeout);
  await page.setUserAgent(userAgent);
  await page.goto(url, { waitUntil: 'networkidle2' });
  return { browser, page };
}

const browserInstance = {
  getPage,
};

module.exports = browserInstance;
