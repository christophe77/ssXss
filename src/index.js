const ssXss = require("./scanner");
const { forms, file } = require("./globals");

// const url = 'http://localhost/xss';
// const url = "http://sudo.co.il/xss/level0.php";
// const url = "http://sudo.co.il/xss/level1.php";
// const url = "http://sudo.co.il/xss/level2.php";
// const url = "http://sudo.co.il/xss/level3.php";
// const url = "http://sudo.co.il/xss/level4.php";
// const url = "https://xss-game.appspot.com/level1/frame";
// const url = 'https://xss-game.appspot.com/level2/frame';
const url = "https://xss-game.appspot.com/level4/frame";

/* 
  const { forms, inputs, file, stream } = require("./globals");
  const options = {
    scanType: forms,
    result: file
  }
  scanType: forms : scan and test all forms and inputs inside given url
  scanType: inputs : scan manual inputs and use given submit selector
  result: file : save report locally to json file
  result: stream : return a json object
*/
const options = {
  scanType: forms,
  result: file,
  userAgent: "UA-SSXSS",
  navigationTimeout: 5000,
  waitForSelectorTimeout: 3000,
  screenDebug: false,
};

/* const selectors = {
  inputs: ['input[name="email"]', 'input[name="username"]'],
  submit: 'input[type="submit"]',
}; */

ssXss.scanForms(url, options);
// ssXss.scanInputs(url, selectors, options);
