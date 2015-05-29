var test      = require('tape')
var validator = require('../index')

test('var validator = require("validator")', function (t) {
    t.ok(validator.validator, 'ok validator.validator')
    t.end()
})

test('var validate = validator.validator(tester, errMsg) # tester is RegExp', function (t) {
    var validate = validator.validator(
        /^voodoo$/, 'value must be "voodoo"'
    )

    t.throws(function () {
        validate('voodooman')
    }, /value must be "voodoo"/, 'value must be "voodoo"')

    t.doesNotThrow(function () {
        validate('voodoo')
    }, null, 'ok validate("voodoo")')

    t.end()
})

test('var validate = validator.validator(tester, errMsg) # tester is function', function (t) {
    var validate = validator.validator(
        function (v) {return v === 'delete' || v > 0 && v < 11}
      , 'set must be "delete" or 1 ~ 10'
    )

    t.throws(function () {
        validate(11)
    }, /set must be "delete" or 1 ~ 10/, 'validate(11) -> throw err')

    t.doesNotThrow(function () {
        validate('delete')
    }, null, 'ok valdiate("delete")')

    t.doesNotThrow(function () {
        validate(9)
    }, null, 'ok valdiate(9)')

    t.end()
})

test('var validate = validator.validator(tester, errMsg) # errMsg is function. return string', function (t) {
    var validate = validator.validator(
        function (v) {return v === 'delete' || v > 0 && v < 11}
      , function (v) { return 'set must be "delete" or 1 ~ 10. you input - "' + v + '"' }
    )

    t.throws(function () {
        validate(11)
    }, /set must be "delete" or 1 ~ 10\. you input - "11"/, "validate(11) -> err 'set must be \"delete\" or 1 ~ 10. you input \"11\"'")

    t.end()
})
test('var validate = validator.validator(tester, errMsg) # errMsg is function. return error object', function (t) {
    var validate = validator.validator(
        function (v) {return v === 'delete' || v > 0 && v < 11}
      , function (v) {
            var e = new Error('set must be "delete" or 1 ~ 10. you input - "' + v + '"')
            e.name = 'ValidateSetError'
            return e
        }
    )

    t.throws(function () {
        validate(11)
    }, /set must be "delete" or 1 ~ 10\. you input - "11"/, "validate(11) -> err 'set must be \"delete\" or 1 ~ 10. you input \"11\"'")

    t.end()
})
