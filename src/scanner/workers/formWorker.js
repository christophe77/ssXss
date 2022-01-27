const puppeteer = require("puppeteer");
const inputWorker = require("./inputWorker");

async function getElementList(form, elementType) {
  const inputList = await form.$$eval(elementType, (inputs) =>
    inputs
      .map((input) => ({
        name: input.getAttribute("name"),
        id: input.getAttribute("id"),
        type: input.getAttribute("type"),
      }))
      .filter((input) => input.type !== "submit" && input.type !== "hidden")
  );
  return inputList;
}

function generateSelectorList(elementType, elementList) {
  return elementList
    .map((element) => {
      if (element.id && element.id !== null) {
        return `${elementType}[id=${element.id}]`;
      } else if (element.name && element.name !== null) {
        return `${elementType}[name=${element.name}]`;
      }
      return "";
    })
    .filter((selector) => selector !== "");
}

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

      const inputList = await getElementList(currentForm, "input");
      const textAreaList = await getElementList(currentForm, "textarea");

      const inputSelectors = generateSelectorList("input", inputList);
      const textAreaSelectors = generateSelectorList("textarea", textAreaList);

      const writableSelectors = []
        .concat(inputSelectors)
        .concat(textAreaSelectors);

      if (writableSelectors.length > 0) {
        await inputWorker.test(url, writableSelectors, formIndex);
      }
    } catch (error) {
      throw error;
    } finally {
      await browserInstance.close();
    }
  }
}

const formWorker = {
  analyse,
};
module.exports = formWorker;
