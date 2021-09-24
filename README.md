# eval-angel

A conditional expression parser and interpreter. This is a safe way to evaluate boolean/logical expressions without using [evil `eval`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#never_use_eval!).

The expressions follow the JavaScript syntax. You can check the comprehensive tests for examples on functionality. Variables are evaluated at a later stage when `evaluate()` function is called with a `context` object. The `context` provides an object with the variables to evaluate. 

Quick example: `evaluate("user.firstName === firstNames[0]", { user: { firstName: 'Mark' }, firstNames: ['John'] })` would return `false`.


## Installation

`npm i eval-angel`


## Supported Types

- Integer (ex: `104`, ...)
- Float (ex: `5.5`, ...)
- String (ex: `'hello'` or `"hello"` -- no backtick (``) syntax yet)

## Unary Operators

- `!expression` (ex: `!true`, `!variable`, `!(expression && expression)`, ...)
<br />

## Equality Operators
- `===` (ex: `5 === 5`, `var === 5`, ...)
- `!==` (ex: `var !== false`, ...)

`==` and `!=` are not supported because they are usually bad practice.
<br />

## Relational Operators
- `>`
- `>=`
- `<`
- `<=`
<br />

## Logical Operators
- `&&`
- `||`


## Grouping

Normal paranthesis grouping can be used to group multiple conditional expressions together.

```js
evaluate("x === 4 && y === 4 || z", { x: 3, y: 5, z: "hello" }); // false
evaluate("(x === 4 && y === 4) || (z)", { x: 3, y: 5, z: "hello" }); // true
```


## Whitespace

Whitespace is allowed where it would usually be expected to be allowed in JavaScript.


## Functions

There are two available functions:

### **evaluate**
The evaluate function evaluates the expression provided. The variables used are read from the context object.
```ts
evaluate(expression: string, context: { [key: string]: any }) => boolean
```

### **parse**

```ts
parse(expression: string) => Evaluatable | string | boolean | number
```

## Examples

```js
const { evaluate } = require("eval-angel");

evaluate("foo.x !== y", { foo: { x: 5 }, y: 5 }); // false
evaluate('gender === "female"', { gender: "female" }); // true
evaluate("5 === potato", { potato: 5 }); // true
evaluate("x <= 76 && (y > 5 || z === 'hello world')", {
  x: 76,
  y: 5,
  z: "hello world",
}); // true
evaluate("!x || y", { x: true, y: 2 }); // true
evaluate("(x || y) === 'world'", { x: false, y: "world" }); // true
```

## Under the hood

This uses `nearley` to generate a parser. Variables are evaluated from the `context` using [lodash.get](https://lodash.com/docs/4.17.15#get). 

Expression are parsed once and are memoized so that consequent operations would just evaluate and not parse those expressions again. Memoization is done on the `parse()` function using [lodash.memoize](https://lodash.com/docs/4.17.15#memoize), so if you need to reset memoization cache you can run `parse.cache.clear()`.

## Additional Thoughts

Some can say that using [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) may be safer than `eval`, but to me both are equally dangerous since they have access to the JavaScript interpreter and `Function` can still see global variables and modify app state.

`eval-angel`'s method is safe because no `eval()` is actually happening. Expressions cannot access any variables not specified in the `context` object. The expression is either parsed correctly and interpreted as needed, or it will fail. No additional code can be run through this and no changes to your app can actually happen. 

`lodash` does come with vulnerabilities sometimes and this package uses both `_.get` and `_.memoize`, so later on it might be worth moving away from lodash (sorry lo, I still love you).


## Development

This package uses Babel to build the source.

If you change the grammar, you need to rebuild it. You can do so using:

```
npm run build:grammar
```

## Test

I have a comprehensive list of tests but I still would like to add more. To run current tests you can use:

```
npm run test 
```

This will not build the grammar before running. If grammar is changed, it needs to be rebuilt using `npm run build:grammar`.

## Coverage

This project has 92% unit tests coverage. I will be adding more tests to have full coverage soon. 


## Contributions

Any contribution is welcome and appreciated. Please create a pull request if you have changes you would like to contribute. 

If you would like to report a bug, please submit an issue.