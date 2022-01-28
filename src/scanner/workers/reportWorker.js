const fs = require("fs");
const path = require("path");

const { resultsPath, screenshotDebugStoragePath } = require("../utils");

let xssLogStream;
const formattedUrl = (url) => {
  return url
    .replace("http://", "")
    .replace("https://", "")
    .replace(/\//g, "-")
    .replace(/\?/g, "")
    .replace(/=/g, "");
};
const fileName = (url) => {
  return `${resultsPath}\\${formattedUrl(url)}.txt`;
};

function createInitialReport(url) {
  const file = fileName(url);
  fs.exists(file, (exists) => {
    if (exists) {
      fs.unlinkSync(file);
    }
    const initialData = `{"url":"${url}"}\r\n`;
    fs.writeFile(file, initialData, { flag: "wx" }, (err, data) => {
      if (err) throw err;
    });
    xssLogStream = fs.createWriteStream(file, { flags: "a" });
  });
}
function clearScreenshots() {
  if (fs.existsSync(screenshotDebugStoragePath)) {
    fs.readdir(screenshotDebugStoragePath, (err, files) => {
      if (err) throw err;
      for (const file of files) {
        if (file !== ".gitkeep") {
          fs.unlink(path.join(screenshotDebugStoragePath, file), (err) => {
            if (err) throw err;
          });
        }
      }
    });
  }
}
function saveToJson(url, selector, payload) {
  const xssData = {
    selector,
    payload,
  };
  xssLogStream.write(JSON.stringify(xssData) + "," + "\r\n");
}

const reportWorker = { createInitialReport, clearScreenshots, saveToJson };

module.exports = reportWorker;
