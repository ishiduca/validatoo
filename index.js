'use strict'
var lodash = require('lodash')

function validator (tester, _errMsg) {
    var test = 'function' === typeof tester.test ? lodash.bind(tester.test, tester) : tester
    return function validate (query) {
        if (test(query)) return true

        var err
        if ('function' === typeof _errMsg) {
            var _err = _errMsg(query)
            if (_err instanceof Error) {
                throw _err
            } else {
                err = new Error(_err)
            }
        } else {
            err = new Error(_errMsg || 'validate fail')
        }

        err.name = 'ValidateError'
        throw err
    }
}

function createSchema (requires, options) {
    var reqKeys = Object.keys(requires || (requires = {}))
    var optKeys = Object.keys(options  || (options  = {}))

    var reqs = lodash.reduce(reqKeys, function (reqs, key) {
        reqs[key] = 'function' === typeof requires[key]
                  ? requires[key]
                  : validator.apply(null, requires[key])
        return reqs
    }, {})

    var opts = lodash.reduce(optKeys, function (opts, key) {
        opts[key] = 'function' === typeof options[key]
                  ? options[key]
                  : validator.apply(null, options[key])
        return opts
    }, {})

    return function schema (query) {
        if (! query || query instanceof Array || 'object' !== typeof query) {
            var err = new TypeError('query must be "object"')
            err.name = 'SchemaTypeError'
            throw err
        }

        var mixedKeys = reqKeys.concat(optKeys)

        lodash.forEach(Object.keys(query), function (key) {
            if (mixedKeys.indexOf(key) === -1) {
                var err = new Error('key "' + key + '" un required')
                err.name = 'SchemaUnRequiredKeyError'
                throw err
            }
        })

        lodash.forEach(reqKeys, function (key) {
            if (!(key in query)) {
                var err = new Error('required key "' + key +'" not found')
                err.name = 'SchemaRequiredKeyNotFoundError'
                throw err
            }

            reqs[key](query[key])
        })

        lodash.forEach(optKeys, function (key) {
            if (key in query) opts[key](query[key])
        })

        return true
    }
}

module.exports.validator = validator
module.exports.schema    = createSchema
