// This code is run after all plugins have initialized

// TODO: i disabled the spa and related plugins (by removing from plugins.json). If the instrumentation of React
// components doesn't work as nicely, consider re-enabling the History plugin. ACTUALLY, document all the plugins
// i disabled from the build and talk about the scenarios we'd re-enable them 

BOOMR.init({
  beacon_url: "/honeycomb_js/send_span",
  beacon_type: "POST",
  instrument_xhr: true,
  ResourceTiming: {
      enabled: true,
      clearOnBeacon: true
  },
  NavigationTiming: {},
  Errors: {
      sendAfterOnload: true,
      sendInterval: 3000,
      // Allow the platform code to disable auto-instrumenting console.error() logs
      // using the following property b/c they clutter things up in dev with some of our utilities.
      monitorConsole: (window.BOOMR.shouldMonitorConsoleErrors === false ? false : true), 
      onError: function(err) {
        // Send across some error fields. Most of the standardization and translation of them
        // is done in honeycomb.js or in the server side controller on the platform, but since
        // the Error plugin only sends across a compressed "err" field, we need to add some of
        // the details into their own fields here for that code to be able to process. 
        // Look for "new BoomerangError" in the plugins/errors.js file for the possible attributes 
        // we can parse and send.
        if (err.type) { 
          BOOMR.addVar('error', err.type);
        } else {
          BOOMR.addVar('error', 'Missing Error Name. See error_detail') }
        }
        if (err.message) { BOOMR.addVar('error_detail', err.message) } 
        if (err.stack) { BOOMR.addVar('error_stacktrace', err.stack) }
        if (err.fileName) { BOOMR.addVar('error_filename', err.fileName) }
        if (err.functionName) { BOOMR.addVar('error_function', err.functionName) }

        // Capture and send to Honeycomb. Add logic here to return false if there are errors 
        // that we want to filter out.
        return true;
      }
  },
  Continuity: {},
  AutoXHR: {
    monitorFetch: true
  },
  Mobile: {},
  Memory: {}, // Also gives screen related info, like dimensions.
  UserTiming: {},
  Braven: {}
});

console.log('Initialized Boomerang');

BOOMR.t_end = new Date().getTime();
