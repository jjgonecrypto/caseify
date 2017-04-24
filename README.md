Caseify
=======
Browserify transform to ensure all dependencies exist in a case-sensitive environment. Checks that all `require` expressions with relative paths point to a file that can be found using a case preserving string match.

Useful for detecting issues in case sensitive module naming on case-insensitive dev machines (such as OS X and WinX) that end up causing issues on Linux based Continuous Integration machines.

Installation
-------

* `npm install --save-dev caseify` install as dev dependency
* add `'caseify'` as a browserify transform via
```json
    {
      "browserify": {
        "transform": [ "caseify" ]
      }
    }
```
or if using Gulp or Grunt, simply add `'casefiy'` to your list of transforms.


Options
-----

To configure how caseify works, add setting in your project's `package.json` file under `caseify`.

* `relativePaths`: Default `false` - show file paths as relative to the current working directory

* `throwOnError`: Default `false` - throw a fatal error if an invalid module is found. This is instead of the default behaviour which emits an error on the browserify stream. Note: this will occur before browserify has processed the file and interrupt it immediately.


eg. `package.json`

```json
 ...
 "devDependencies": {
     "caseify": "~0.1"
 },
 "caseify": {
    "relativePaths": true,
    "throwOnError": true
  },
  ...
```

Example
------

Within this directory structure:

    moduleA.js
    |-- deps/moduleB.js
    |-- deps/moduleC.js

if __moduleA.js__ contains:
```javascript
var moduleB = require('./deps/moduleb');
```

running: `browserify -t caseify module*.js > module.bundle.js`

causes this output:

    Caseify: /Users/jmoses/example/moduleA.js module ./deps/moduleb not found in case-sensitive environment
