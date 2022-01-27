const puppeteer = require("puppeteer");
async function getPage(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(5000);
  await page.setUserAgent("UA-SSXSS");
  await page.goto(url, { waitUntil: "networkidle2" });
  return { browser, page };
}
const browserInstance = {
  getPage,
};
module.exports = browserInstance;
