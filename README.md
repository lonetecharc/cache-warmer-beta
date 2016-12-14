###BETA VERSION OF CACHE WARMER


### Step-by-step install guide
1. Install [NodeJS](https://github.com//joyent/node) from your package manager. On OS X this is `brew install node`.
2. Install [Typings](https://www.npmjs.com/package/typings) globally with `npm install -g typings`.
3. Install project specific dependencies with `npm install`.
4. Install typings
     - `typings install dt~axios --global --save`
     - `typings install dt~colors --global --save`
     - `typings install dt~config --global --save`
     - `typings install dt~es6-shim --global --save`
     - `typings install dt~<mixpanel> --global --save`
     - `typings install dt~<moment> --global --save`
5. Start Cache Warmer code with `npm start client=<CLIENT_VALUE>` viz. CLIENT_VALUE = nbcGeneretic OR nbcAppAndriod OR nbcRokuApp OR nbcAppIos

### Config values to be set
1. FromMixpanel = true
2. key = MixPanel_project_api_key
3. secret = MixPanel_project_api_secret
4. Hour_Of_The_Day = any number between 0 to 23
5. Minute_of_Hour = any valid minute value for the hour viz. 15:00 OR 12:02
6. Resources_To_Warm = Array of resources viz.["shows","videos","schedules","collections"]