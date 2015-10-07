var page   = require('webpage').create();
var system = require('system');
var config = require('./config');

var userAgent = config.userAgent || null;
var width     = config.width || null;
var height    = config.height || null;

if ( system.args.length < 4 ) {
  console.log('Usage: ' + system.args[0] + ' url [font]');
  phantom.exit();
}

var url    = system.args[1];
var style  = system.args[2];
var values = JSON.parse(system.args[3]);


/*page.onconsolemessage = function (msg) {
  console.log(msg);
};*/

page.onError = function(msg, trace) {
};

if (width && height) {
  page.viewportSize = {
    width: width,
    height: height
  };
}

if (userAgent) {
  page.settings.userAgent = userAgent;
}

page.open(url, function (status) {
  if ( status !== 'success' ) {
    console.log('Unable to access network');
  } else {
    var results = page.evaluate(function(style, values) {
      var results = [];

      var testElementStyle = function(element, style, values) {
        var result = null;

        var computedStyle = window.getComputedStyle(element);
        var computedValue = computedStyle[style];

        if ( values.indexOf(computedValue) !== -1) {
          result = {
            class: element.className,
            id: element.id,
            tag: element.tagName,
            data: element.outerHTML,
            style: style,
            value: computedValue
          };
        }

        return result;
      };

      var elements = document.body.getElementsByTagName("*");

      for ( var i=0; i<elements.length; i++ ) {
        var element = elements[i];

        var result = testElementStyle(element, style, values);

        if (result) {
          results.push(result);
        }
      }

      return results;
    }, style, values);

    console.log(JSON.stringify(results));
  }

  phantom.exit();
});
