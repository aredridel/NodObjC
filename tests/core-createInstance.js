var b = require('../core')

var NSMutableArray = b.objc_getClass('NSMutableArray')
  , NSString = b.objc_getClass('NSString')
  , NSAutoreleasePool = b.objc_getClass('NSAutoreleasePool')

var alloc = b.sel_registerName('alloc')
  , init = b.sel_registerName('init')
  , describe = b.sel_registerName('description')
  , UTF8String = b.sel_registerName('UTF8String')
  , addObject = b.sel_registerName('addObject:')
  , sortUsingFunction = b.sel_registerName('sortUsingFunction:context:')
  , UTF8StringMethod = b.class_getInstanceMethod(NSString, UTF8String)
  , allocMethod = b.class_getClassMethod(NSMutableArray, alloc)
  , addObjectMethod = b.class_getInstanceMethod(NSMutableArray, addObject)
  , sufMethod = b.class_getInstanceMethod(NSMutableArray, sortUsingFunction)

var msgSend = b.get_objc_msgSend(getTypes(allocMethod))
  , msgSend2 = b.get_objc_msgSend(getTypes(UTF8StringMethod))
  , msgSend3 = b.get_objc_msgSend(getTypes(addObjectMethod))
  , msgSend4 = b.get_objc_msgSend(getTypes(sufMethod))
  , pool = msgSend(msgSend(NSAutoreleasePool, alloc), init)
  , instance = msgSend(msgSend(NSMutableArray, alloc), init)

msgSend3(instance, addObject, NSString);
msgSend3(instance, addObject, NSMutableArray);


// toString() before sort
console.error(msgSend2(msgSend(instance, describe), UTF8String));

// we can sort, using a JavaScript function to do the sorting logic!!!
// In this simple example we sort based on the length of the class name
var callback = new b.Callback([ 'int32', [ 'pointer', 'pointer', 'pointer' ]], function (obj1, obj2, context) {
  var n1 = b.class_getName(obj1)
    , n2 = b.class_getName(obj2)
  return n1.length < n2.length ? -1
       : n2.legnth > n1.length ? 1
       :  0;
});

msgSend4(instance, sortUsingFunction, callback.getPointer(), instance);


// toString() after sort
console.error(msgSend2(msgSend(instance, describe), UTF8String));


function getTypes (method) {
  if (method.isNull()) throw new Error('bad pointer!');
  var args = []
    , types = []
    , numArgs = b.method_getNumberOfArguments(method)
    , rtnTypePtr = b.method_copyReturnType(method)
    , rtnType = rtnTypePtr.getCString()
  b.free(rtnTypePtr);
  types.push(rtnType);
  types.push(args);
  for (var i=0; i<numArgs; i++) {
    var argPtr = b.method_copyArgumentType(method, i)
    args.push(argPtr.getCString());
    b.free(argPtr);
  }
  return types;
}
