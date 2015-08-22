var VError = require('verror')

function lodashify (name) {
  return 'lodash.' + name
}

var aliases = {
  foreach : 'forEach'
}

function aliasify (name) {
  return aliases[name] || name
}

function loquire (name) {
  var lodashName = lodashify(name)

  try {
    require.resolve(lodashName)
  }

  catch (e) {
    throw new VError(e, 'Lodash method ' + name + 'is not installed!')
  }

  return require(lodashName)
}

function addChainable (_, name) {
  var method = loquire(name)

  _[aliasify(name)] = function () {
    _.__wrapped__ = method.apply(method, [_.__wrapped__].concat(arguments))
    return _
  }
}

function lochain (iteratee, methodNames) {
  var _ = Object.create({
    __wrapped__ : iteratee,
    __actions__ : [ ],
    __chain__   : true,

    value       : function () {
      return this.__wrapped__
    },

    tap         : function (interceptor) {
      interceptor(this.__wrapped__)
      return this.__wrapped__
    }
  })

  methodNames.forEach(function (name) {
    addChainable(_, name)
  })

  return _
}

module.exports = lochain
