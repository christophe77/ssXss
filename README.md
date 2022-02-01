# ssXss

XSS scanner using pupetteer with nodeJS<br />

## Install

Clone the project and install the dependencies :<br />

    git clone https://github.com/christophe77/ssXss
    cd ssXss
    yarn install

## How to use

### From command line

Edit _/src/index.js_ file and fill _url_ constant with the url you want to scan.<br />
You can also edit the default options.<br />
I suggest you not to change the timeout values, they are a good compromise between speed and accuracy.<br />
If you want to scan and check all inputs inside all forms of the url, set _scanType: forms_<br/>
If you want to check some specific inputs, set _scanType: inputs_<br/>
If you want to test all payloads after an url parameter, set _scanType: urlParam_<br/>
If you want to store the results inside a json file, set _result: file_<br/>
If you want to receive the results in json stream, set _result: stream_<br/>
Use ssXss.scanForms(url, options) for full page scanning.<br />
Create a selector object if you want to scan specific inputs :<br />

    const selectors = {
        inputs: ['input[name="email"]', 'input[name="username"]'],
        submit: 'input[type="submit"]',
    };

You can now start scanning.<br />

    yarn start:cmd

### From express

Edit _/src/express/index.js_ file and set the port that you want.<br />

    yarn start:web

## Customization

You can add more xss payloads in _/scanner/payloads.js_ file. <br />
Payload must execute console.log("ssxss") or alert("ssxss") and user action can be none or "onmouseover". <br />

## Future

The current version of ssXss is working well but it needs improvements :<br/>

- Improve speed.
- Improve DOM analysis to go deeper.
- Make npm package.

## Contribution

Any contribution is accepted.<br />

## Bugs

If you find any bugs, please feel an issue report.<br />
If you have a website with an XSS vulnerability that is not discovered by ssXss you can contact me.<br />

## Demo

[http://165.227.229.84:6969/](http://165.227.229.84:6969/)
