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
  return `${resultsPath}\\${formattedUrl(url)}.json`;
};

function createInitialReport(url) {
  console.log("\x1b[36m%s\x1b[0m", "Creating report");
  const file = fileName(url);
  fs.exists(file, (exists) => {
    if (exists) {
      fs.unlinkSync(file);
    }
    const initialData = `{"result":{"url":"${url}", "vulnerabilities":[`;
    fs.writeFile(file, initialData, { flag: "wx" }, (err, data) => {
      if (err) throw err;
    });
    xssLogStream = fs.createWriteStream(file, { flags: "a" });
  });
}
function closeReport(url) {
  console.log("\x1b[36m%s\x1b[0m", "Closing report");
  xssLogStream.end();
  const file = fileName(url);
  const reportData = fs.readFileSync(file, "utf8").replace(/\s+/g, '');
  const sanitizedReportData = `${reportData.slice(0, -1)}]}}`;
  fs.writeFileSync(file, sanitizedReportData);
}
function clearScreenshots() {
  console.log("\x1b[36m%s\x1b[0m", "Clearing screenshots");
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

const reportWorker = {
  createInitialReport,
  clearScreenshots,
  closeReport,
  saveToJson,
};

module.exports = reportWorker;
