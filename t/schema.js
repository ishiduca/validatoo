var test      = require('tape')
var validator = require('../')

var Schema = validator.schema

test('var Schema = require("validator").schema', function (t) {
    t.ok('function' === typeof Schema, 'ok Schema')
    t.end()
})

test('var schema = Schema({required}[, {optional}])', function (t) {
    t.ok('function' === typeof Schema(), 'ok schema')
    t.end()
})

test('var schema = Schema({foo: Array(tester, _errMsg)})', function (t) {
    var schema = Schema({
        foo: [
            function (v) { return v === parseInt(v, 10) }
          , '"foo" is required. and "foo" must be "Int"'
        ]
    })

    t.throws(function () {
        schema({foo: 1.2})
    }, /"foo" is required\. and "foo" must be "Int"/
     , 'schema({foo: 1.2}) -> throw error "foo" is required. and "foo" must be "Int"')

    t.doesNotThrow(function () {
        schema({foo: 2})
    }, null, 'ok schema({foo: 2})')

    t.end()
})

test('var schema = Schema({foo: Function})', function (t) {
    var schema = Schema({
        foo: validator.validator(
            function (v) {return v > 0}
          , '"foo" is required. and "foo" must be over 0'
        )
    })

    t.throws(function () {
        schema({foo: 0})
    }, /"foo" is required\. and "foo" must be over 0/
     , 'schema({foo: 0}) -> throw error "foo" is required. and "foo" must be "Int"')

    t.doesNotThrow(function () {
        schema({foo: 1})
    }, null, 'ok schema({foo: 1})')

    t.end()
})


test('schema(type is not object)', function (t) {
    t.throws(function () {
        Schema()()
    }, /SchemaTypeError/, 'schema(undefined) -> throw SchemaTypeError')

    t.throws(function () {
        Schema()(null)
    }, /SchemaTypeError/, 'schema(null) -> throw SchemaTypeError')

    t.throws(function () {
        Schema()([])
    }, /SchemaTypeError/, 'schema([]) -> throw SchemaTypeError')

    t.throws(function () {
        Schema()("non-object")
    }, /SchemaTypeError/, 'schema("non-object") -> throw SchemaTypeError')

    t.end()
})

test('schema(query has un required key)', function (t) {
    var schema = Schema({
        requires: [ /^abc$/ ]
    }, {
        optionals: [ /^def$/ ]
    })

    t.throws(function () {
        schema({ghi: 'ghi', requires: 'abc'})
    }, /key "ghi" un required/, 'key "ghi" un required')

    t.doesNotThrow(function () {
        schema({requires: 'abc'})
    }, null, 'ok schema({requires: "abc"})')

    t.doesNotThrow(function () {
        schema({requires: 'abc', optionals: 'def'})
    }, null, 'ok schema({requires: "abc", optionals: "def"})')

    t.end()
})

test('schema(query does not have required key)', function (t) {
    var schema = Schema({
        requires: [function (v) { return !! v}]
    }, {
        optional: [function (v) { return !! v}]
    })

    t.throws(function () {
        schema({optional: 'optional'})
    }, /SchemaRequiredKeyNotFoundError/
    , 'schema({optional: "optional"}) -> throw SchemaRequiredKeyNotFoundError')

    t.doesNotThrow(function () {
        schema({requires: 'requires'})
    }, /SchemaRequiredKeyNotFoundError/, 'ok schema({requires: "requires"})')

    t.end()
})

test('complex query', function (t) {
    var opt = Schema({
        id: validator.validator(
            /^[0-9a-zA-Z\-_.]+$/
          , 'when you use "option", "option.id" is required'
        )
      , set: validator.validator(
            function (v) {
                return v === '[delete]' || v > 0 && v === parseInt(v, 10)
            }
          , 'when you use "option", "option.set" is "Int" (or "[delete]"'
        )
    })

    var schema = Schema({
        name: validator.validator(/^\w+ \w+$/, '"name" is required.')
    }, {
        option: opt
    })

    t.doesNotThrow(function () {
        schema({name: 'tom son'})
    }, null, 'ok schema({name: "tom son"})')

    t.throws(function () {
        schema({name: 'tom son', foo: 'hoge'})
    }, /key "foo" un required/
     , 'schema({name: "tom son", foo: "hoge"}) -> throw SchemaUnRequiredKeyError')

    t.doesNotThrow(function () {
        schema({name: 'tom son', option: {
            id: 'abc-098-as', set: 9
        }})
    }, null, 'ok schema({complex query})')

    t.throws(function () {
        schema({name: 'tom som', option: {
            id: 'abc=99=dub', set: 9
        }})
    }, /ValidateError/
     , 'schema(wrong query) -> throw error')

    t.end()
})
