var chai = require('chai')
var expect = chai.expect
var dequire = require('clear-require')

describe('lochain', function () {
  var lochain
  var iteratee

  beforeEach(function () {
    lochain  = require('.')
    iteratee = {
      E  : Math.E,
      PI : Math.PI,
      F  : 1
    }
  })

  afterEach(function () {
    dequire('.')
    iteratee = null
  })

  it('takes an [] of module names (sans "lodash.") ' +
     'and makes them chainable', function () {

    var chainableIteratee = lochain(iteratee, ['values', 'pick'])

    chainableIteratee.pick('PI', 'F')

    expect(chainableIteratee.value()).to.eql({
      PI : Math.PI,
      F  : 1
    })

    var values = chainableIteratee.values()
    expect(values.value()).to.eql([ Math.PI, 1 ])

    chainableIteratee.tap(function (wrapped) {
      wrapped.pop()
    })

    expect(chainableIteratee.value()).to.eql([ Math.PI ])
  })
})
