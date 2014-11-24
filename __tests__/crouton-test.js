// __test__/crouton-test.js

jest.dontMock('../index.js')

var React = require('react/addons')
var Crouton = require('../index.js')
var TestUtils = React.addons.TestUtils

describe('Crouton', function () {

  it('should render a simple crouton', function () {

    // Render a crouton with message and type
    var data = {
      id: 123213,
      message: 'simple',
      type: 'error',
      hidden: false
    }
    var crouton = TestUtils.renderIntoDocument(
      Crouton({
        id: data.id,
        message: data.message,
        type: data.type,
        hidden: data.hidden
      }))
      // Verify crouton hidden false
    var pdiv = TestUtils.findRenderedDOMComponentWithClass(crouton, 'crouton')
    expect(pdiv.getDOMNode().hidden, false)
      // Verify textContent
    var cdiv = TestUtils.findRenderedDOMComponentWithClass(crouton, data.type)
    expect(cdiv.getDOMNode().textContent, data.message)
      // Verify has a child span
    var spans = cdiv.getDOMNode().getElementsByTagName('span')
    expect(spans.length, 1)
    expect(spans[0], data.message)
      // No buttons
    expect(cdiv.getDOMNode().getElementsByTagName('button'), [])
      // Crouton will hidden after 2000 ms default
    runs(function () {
      setTimeout(function () {
        expect(pdiv.getDOMNode().hidden, true)
      }, 2000)
    })
  })

  it('should render an message array', function () {
    // Render a crouton with message and type
    var data = {
      id: 123213,
      message: ['simple', 'message'],
      type: 'error',
      hidden: false
    }
    var crouton = TestUtils.renderIntoDocument(
      Crouton({
        id: data.id,
        message: data.message,
        type: data.type,
        hidden: data.hidden
      }))
    var pdiv = TestUtils.findRenderedDOMComponentWithClass(crouton, 'crouton')
    var cdiv = TestUtils.findRenderedDOMComponentWithClass(crouton, data.type)
      // Verify has a child span
    var spans = cdiv.getDOMNode().getElementsByTagName('span')
    expect(spans.length, 2)
    data.message.forEach(function (msg, i) {
      expect(spans[i], data.message[i])
    })
    var done = false
      // Crouton will hidden after 2000 ms default
    runs(function () {
      setTimeout(function () {
        expect(pdiv.getDOMNode().hidden, true)
      }, 2000)
    })
  })
})
