const puppeteer = require("puppeteer");
const inputWorker = require("./inputWorker");

async function analyse(url, formElementCount) {
  for (let formIndex = 0; formIndex < formElementCount; formIndex++) {
    const browserInstance = await puppeteer.launch();
    const page = await browserInstance.newPage();
    await page.setDefaultNavigationTimeout(5000);
    await page.setUserAgent("UA-NODE-XSS-SCANNER");
    await page.goto(url, { waitUntil: "networkidle2" });

    try {
      const formElements = await page.$$("form");
      const currentForm = formElements[formIndex];

      const inputList = await currentForm.$$eval("input", (inputs) =>
        inputs
          .map((input) => ({
            name: input.getAttribute("name"),
            id: input.getAttribute("id"),
            type: input.getAttribute("type"),
          }))
          .filter(
            (input) =>
              input.type && input.type !== "submit" && input.type !== "hidden"
          )
      );
      const inputSelectors = inputList
        .map((input) => {
          if (input.id && input.id !== null) {
            return `input[id=${input.id}]`;
          } else if (input.name && input.name !== null) {
            return `input[name=${input.name}]`;
          }
          return "";
        })
        .filter((selector) => selector !== "");

      const textAreaList = await currentForm.$$eval("textArea", (textAreas) =>
        textAreas.map((textArea) => ({
          name: textArea.getAttribute("name"),
          id: textArea.getAttribute("id"),
        }))
      );
      const textAreaSelectors = textAreaList
        .map((textArea) => {
          if (textArea.id && textArea.id !== null) {
            return `textarea[id=${textArea.id}]`;
          } else if (textArea.name && textArea.name !== null) {
            return `textarea[name=${textArea.name}]`;
          }
          return "";
        })
        .filter((selector) => selector !== "");

      const writableSelectors = []
        .concat(inputSelectors)
        .concat(textAreaSelectors);

      if (writableSelectors.length > 0) {
        await inputWorker.test(url, writableSelectors, formIndex);
      }
    } catch (error) {
      console.log(error);
    } finally {
      await browserInstance.close();
    }
  }
}

const formWorker = {
  analyse,
};
module.exports = formWorker;
