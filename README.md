###BETA VERSION OF CACHE WARMER


### Step-by-step install guide
1. Install [NodeJS](https://github.com//joyent/node) from your package manager. On OS X this is `brew install node`.
2. Install [Typings](https://www.npmjs.com/package/typings) globally with `npm install -g typings`.
3. Install project specific dependencies with `npm install`.
4. Install all typings in package.json with - `typings install dt~<object_name> --global --save`
5. Start Cache Warmer code with `npm start`