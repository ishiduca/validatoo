# validatoo

a tool to validate an nested object. (based on schema)

## usage

```js
var validatoo = require('validatoo')
var schema    = validatoo.schema
var validator = validatoo.validator

var s = schema({
    required: validator(
        function (v) { return v > 0 && v === parseInt(v, 10) }
      , '"required" key is required and must be an "Interger"'
    )
}, {
    optional: validator(
        /^\w{4,8}$/
      , '"optional" key is optional and must be 4~8 charactors'
    )
})

try {
    s({required: 3.14})
} catch (err) {
    // "required" key is required and must be an "Interger"
}

try {
    s({required: 10, optional: 'foo'})
} catch (err) {
    // "optional" key is optional and must be 4~8 charactors
}

```

## api

### var validate = validatoo.validator(RegExpOrFunc[,errorMessage])

return a validated function

* **RegExpOrFunc** __RegExp__ | __function__ in order to validate
* **errorMessage** __String__ | __function__ error message

```js
var validate = validatoo.validator({
    /^\d{3}$/
  , 'ex : "123", "001"'
})

try {
    validate('01a')
} catch (err) {
    // ex: "123", "001"
}
```

### var schema = validatoo.schema(required[,optional])

return a schema function

* **required** __Object__ collection of validated function of the required elements
* **optional** __Object__ collection of validated function of the optional elements

```js
var scheme = validatoo.schema({
    id: validatoo.validator(
        /^[0-9a-zA-Z-]+$/
      , '"id" key is required'
    )
  , name: validatoo.validator(
        function (v) { return 'string' === typeof v && v.trim().length > 0 }
      , '"name" key is required'
    )
}, {
    nickName: validatoo.validator(
        function (v) { return 'string' === typeof v && v.trim().length > 0 }
      , '"nickName" key is optional.'
    )
})

try {
    schema({
        id: '451da500-dccb-11e4-b0aa-7b2099ec21e8'
      , nickName: 'bimota'
    })
} catch (err) {
    // SchemaRequiredKeyNotFoundError: required key "name" not found
}
```

## complex example

```js
var address = validatoo.schema({
    country: validatoo.validator(
        /^\w+$/
      , '"address.country" is required'
    )
  , city: validatoo.validator(
        /^\w+$/
      , '"address.city" is required'
    )
})

var user = validatoo.schema({
    firstName:  validatoo.validator(/^\w+$/)
  , familyName: validatoo.validator(/^\w+$/)
}, {
    address: address
})


try {
    user({
        firstName: 'John'
      , familyName: 'Moo'
    })
} catch (err) {
    // no error
}

try {
    user({
        firstName: 'John'
      , familyName: 'Moo'
      , address: {
            city: 'magicCity'
        }
    })
} catch (err) {
    // "address.country" is required
}
```

## test

```
$ npm test
```

### for browser

```
$ npm run testling
```


## author

ishiduca@gmail.com

## license

MIT
