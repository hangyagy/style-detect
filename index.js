var testStyle = require('./test_style');

if ( process.argv.length < 3 ) {
  throw new Error('Missing parameter url!');
}

var url    = process.argv[2];
var style  = process.argv[3];
var tested = process.argv.slice(4, process.argv.length);

testStyle(url, 'overflow', tested)
  .then(function(result) {
    console.log(JSON.stringify(result, null, 4));
  })
  .catch(function(err) {
    throw err;
  });
