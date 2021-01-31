[![npm version](https://badge.fury.io/js/inquirer-ordinal-prompt.svg)](https://npmjs.com/package/inquirer-ordinal-prompt)
![Build](https://github.com/RecuencoJones/inquirer-ordinal-prompt/workflows/Build/badge.svg)

# inquirer-ordinal-prompt

Ordinal prompt for [inquirer](https://github.com/SBoudrias/Inquirer.js)

## Installation

```
npm install --save inquirer inquirer-ordinal-prompt
```

## Usage

```js
inquirer.registerPrompt('ordinal', require('inquirer-ordinal-prompt').default);

inquirer.prompt({
  type: 'ordinal',
  name: 'scripts',
  message: 'Pick scripts to run in order',
  choices: [ 'Build', 'Lint', 'Test' ],
  default: [ 'Build' ]
});
```

## Options

Take `type`, `name`, `message`, `choices`[, `filter`, `validate`, `default`] properties.
`default` is expected to be an Array of the ordered choices value.

ordinal prompt is mostly the same as [checkbox prompt](https://github.com/SBoudrias/Inquirer.js#checkbox---type-checkbox), with slight differences:

- it doesn't use `checked` property and instead leverages `default` as an ordered list of choice values.
- selecting a choice will show ordinal index instead of filled checkbox.

## Example

You can find a running example in [demo.js](https://github.com/RecuencoJones/inquirer-ordinal-prompt/blob/develop/demo.js)

[![asciicast](./demo.gif)](https://asciinema.org/a/BAL0gV4p1PqFgcdfzc1ndd3Jk)
