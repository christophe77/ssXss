const ssXss = require("./scanner");
const args = process.argv.slice(2);

// const devUrl = "http://localhost/xss";
// const devUrl = "http://sudo.co.il/xss/level0.php";
// const devUrl = "http://sudo.co.il/xss/level1.php";
// const devUrl = "http://sudo.co.il/xss/level2.php";
// const devUrl = "http://sudo.co.il/xss/level3.php";
// const devUrl = "http://sudo.co.il/xss/level4.php";
// const devUrl = "https://xss.challenge.training.hacq.me/challenges/baby01.php";
// const devUrl = "https://xss-game.appspot.com/level1/frame";
const devUrl = "https://xss-game.appspot.com/level2/frame";

const url = args[0] || devUrl;
const options = {
  screenDebug: false,
  userAgent: "UA-SSXSS",
  navigationTimeout: 5000,
  waitForSelectorTimeout: 3000,
};
ssXss.scan(url, options);
