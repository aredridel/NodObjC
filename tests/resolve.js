var imp = require('../import')
  , assert = require('assert')

check(imp.resolve('Foundation'));
check(imp.resolve('CoreFoundation'));
check(imp.resolve('DebugSymbols'));

assert.throws(function() {
  imp.resolve('DOES NOT EXIST')
});


// Just check that an absolute path is returned
function check (path) {
  console.error(path);
  assert.ok(~path.indexOf('/'));
}
