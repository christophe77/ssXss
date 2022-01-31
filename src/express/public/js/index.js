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
    const div = document.createElement("div");
    const startHtml = '<h4>Results :</h4><br /><ul class="collection">';
    let resutlHtml = "";
    for (let i = 0; i < result.vulnerabilities.length; i++) {
      resutlHtml = `${resutlHtml}<li class="collection-item">
        <b>selector :</b><xmp>${result.vulnerabilities[i].selector}</xmp>
        <b>payload :</b><xmp>${result.vulnerabilities[i].payload}</xmp></li>
      `;
    }
    div.innerHTML = `${startHtml}${resutlHtml}</ul>`;
    resultContainer.appendChild(div);
  } else {
    const div = document.createElement("div");
    div.innerHTML = `
        <span>No result found for ${urlToScan}</span>
      `;
    resultContainer.appendChild(div);
  }
}
function scan() {
  resultContainer.innerHTML = "";
  const urlToScan = document.getElementById('url').value;
  const inputs = document.getElementById('inputs').value;
  const submit=  document.getElementById('submit').value;

  if (urlToScan && urlToScan !== "") {
    btnScan.setAttribute("disabled", "disabled");
    loadingBar.style.display = "";

    const http = new XMLHttpRequest();
    let params = {};
    if (inputs && submit) {
      const selectors = {
        inputs : inputs.split(","),
        submit,
      };
      params = JSON.stringify({
        urlToScan: urlToScan,
        selectors: selectors,
      });
      http.open("POST", "/scan-inputs", true);
    } else {
      params = JSON.stringify({ urlToScan: urlToScan });
      http.open("POST", "/scan-forms", true);
    }
    http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    http.onload = function () {
      const results = http.response;
      const resultObject = JSON.parse(results).result;
      appendData(urlToScan, resultObject);
    };
    http.send(params);
  }
}
