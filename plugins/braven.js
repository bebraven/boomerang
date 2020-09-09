// Adds a "Braven" plugin to Boomerang in order to handle adding the info that
// the server side needs in order to authentcate this request and propogate the
// beacons to existing Honeycomb traces.
(function() {
    // First, make sure BOOMR is actually defined.  It's possible that your plugin
    // is loaded before boomerang, in which case you'll need this.
    BOOMR = window.BOOMR || {};
    BOOMR.plugins = BOOMR.plugins || {};

    // A private object to encapsulate all your implementation details
    // This is optional, but the way we recommend you do it.
    var impl = {

      addSessionInfo: function(vars) {
        if(vars) {

          // We could be running in the normal document or inside an iframe used to 
          // preload this script. Need to get the effective "document" which BOOMR.window takes care of.
          // Note: the domain stuff to allow us to be able to access the parent is taken care of in boomerang.js
          var doc = BOOMR.window.document; 
          vars["trace.serialized"] = doc.querySelector('meta[name="serialized-trace"]').content;

          // This is intended to be used by all javascript in the platform code. Not everything
          // is guaranteed to be in the context of an LtiLaunch with a state param, but if it is
          // we to send that across so the request can be authenticated in sessionless broswers
          // (aka Chrome incognito running our platform pages as an iframe inside Canvas).
          var state = doc.querySelector('meta[name="state"]');
          if (state) {
              vars["state"] = state.content;
          }
        }
      }
    };

    //
    // Public exports
    //
    BOOMR.plugins.Braven = {
        init: function(config) {
            BOOMR.subscribe("before_beacon", impl.addSessionInfo, null, impl);
            return this;
        },

        // Any other public methods would be defined here

        is_complete: function() {
            // This method should determine if the plugin has completed doing what it
            // needs to do and return true if so or false otherwise
            return true;
        }
    };
}());
