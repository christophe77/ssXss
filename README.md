# ssXss

XSS scanner using pupetteer with nodeJS<br />

## How to use

Clone the project and install the dependencies :<br />

    git clone https://github.com/christophe77/ssXss
    cd ssXss
    yarn install

Edit _/src/index.js_ file with the url you want to scan.<br />
Save and run :<br />

    yarn start

Logs will be saved inside the _/results_ folder. <br />
You can add more xss payloads in _/scanner/payloads.js_ file. <br />
Payload must execute console.log("ssxss") or alert("ssxss"). <br />

## Future

The current version of ssXss is working well but it needs improvements :<br/>

- Improve speed.
- Improve DOM analysis to go deeper.
- Add a UI with express or some console logs.
