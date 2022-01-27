const fs = require("fs");

let xssLogStream;

const filename = (url) => {
  const formattedUrl = url
    .replace("http://", "")
    .replace("https://", "")
    .replace(/\//g, "-")
    .replace(/\?/g, "")
    .replace(/=/g, "");
  return `${process.cwd()}/results/${formattedUrl}.txt`;
};

function createInitialReport(url) {
  const file = filename(url);
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

function saveToJson(url, selector, payload) {
  const xssData = {
    selector,
    payload,
  };
  xssLogStream.write(JSON.stringify(xssData) + "," + "\r\n");
}

const reportMaker = { createInitialReport, saveToJson };

module.exports = reportMaker;
