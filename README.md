# ssXss

XSS scanner using pupetteer with nodeJS<br />

## Install

Clone the project and install the dependencies :<br />

    git clone https://github.com/christophe77/ssXss
    cd ssXss
    yarn install

## How to use

### From command line

Edit _/src/index.js_ file and fill _devUrl_ with the url you want to scan.<br />
You can also edit the default options. I suggest you not to change the timeout values, they are a good compromise between speed and accuracy.<br />
Save and run :<br />

    yarn start:file

You can also just start the scanner with :<br />

    yarn scan http://<url>/<path>

Results will be saved in json inside the _/results_ folder. <br />

### From express

    yarn start:web

## Customization

You can add more xss payloads in _/scanner/payloads.js_ file. <br />
Payload must execute console.log("ssxss") or alert("ssxss") and user action can be none or "onmouseover". <br />

## Future

The current version of ssXss is working well but it needs improvements :<br/>

- Improve speed.
- Improve DOM analysis to go deeper.

## Contribution

Any contribution is accepted.<br />

## Bugs

If you find any bugs, please feel an issue report.<br />
If you have a website with an XSS vulnerability that is not discovered by ssXss you can contact me.<br />
