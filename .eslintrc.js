module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["airbnb-base", "eslint:recommended", "prettier"],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-await-in-loop": 0,
    "no-console": 0,
    "no-param-reassign": 0,
    "no-unsafe-finally": 0,
    semi: ["error", "always"],
    "prettier/prettier": [
      "error",
      {
        trailingComma: "es5",
        singleQuote: false,
        printWidth: 80,
        tabWidth: 2,
        endOfLine: "auto",
        arrowParens: "always",
      },
    ],
  },
};
