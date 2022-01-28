const btnScan = document.getElementById("scan");
const loadingBar = document.getElementById("loading");
const resultContainer = document.getElementById("results");

document.addEventListener("DOMContentLoaded", () => {
  loadingBar.style.display = "none";
});

function appendData(urlToScan, result) {
  btnScan.removeAttribute("disabled");
  loadingBar.style.display = "none";
 
  if (result && result.vulnerabilities && result.vulnerabilities.length > 0) {
    for (let i = 0; i < result.vulnerabilities.length; i++) {
      const div = document.createElement("div");
      div.innerHTML = `
        <b>selector :</b><xmp>${result.vulnerabilities[i].selector}</xmp>
        <b>payload :</b><xmp>${result.vulnerabilities[i].payload}</xmp><hr />
      `;
      resultContainer.appendChild(div);
    }
  } else {
    const div = document.createElement("div");
    div.innerHTML = `
        <span>No result found for ${urlToScan}</span>
      `;
    resultContainer.appendChild(div);
  }
}
function scan(urlToScan) {
  resultContainer.innerHTML = "";
  if (urlToScan && urlToScan !== "") {
    btnScan.setAttribute("disabled", "disabled");
    loadingBar.style.display = "";
    const params = JSON.stringify({ urlToScan: urlToScan });
    const http = new XMLHttpRequest();
    http.open("POST", "/scan", true);
    http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    http.onload = function () {
      const results = http.response;
      const resultObject = JSON.parse(results).result;
      appendData(urlToScan, resultObject);
    };
    http.send(params);
  }
}
