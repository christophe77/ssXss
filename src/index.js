const ssXss = require("./scanner");
const options = {
  screenDebug: true,
  userAgent: "UA-SSXSS",
  navigationTimeout: 5000,
  waitForSelectorTimeout: 3000
};
// ssXss.scan("http://localhost/xss");
// ssXss.scan("http://sudo.co.il/xss/level0.php");
// ssXss.scan("http://sudo.co.il/xss/level1.php");
// ssXss.scan("http://sudo.co.il/xss/level2.php");
// ssXss.scan("http://sudo.co.il/xss/level3.php");
// ssXss.scan("http://sudo.co.il/xss/level4.php");
// ssXss.scan("https://xss.challenge.training.hacq.me/challenges/baby01.php");
ssXss.scan("https://xss-game.appspot.com/level1/frame", options);
