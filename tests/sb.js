var $ = require('../')

$.import('Foundation')
$.import('ScriptingBridge')

var pool = $.NSAutoreleasePool('new')

var bi = $.NSString('stringWithUTF8String', 'com.apple.iTunes')
  , iTunes = $.SBApplication('applicationWithBundleIdentifier', bi)

console.log(iTunes);
console.log(iTunes('name'));
