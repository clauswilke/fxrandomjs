# fxrandomjs

A simple, zero-dependency deterministic pseudorandom number generator and set of helper functions to make random choices.

This library is primarily meant to be used for generative art projects on fxhash.xyz, but it is standalone and can be used anywhere.

The actual random number generator code was taken from the template provided at: https://github.com/fxhash/fxhash-webpack-boilerplate

Installation:

```sh
npm install https://github.com/clauswilke/fxrandomjs
```

Usage:

```js
const FXRandom = require("fxrandomjs")

// `fxhash` is a variable holding a 52 digit alphanumeric hash,
// provided by the fxhash template. Outside of this environment,
// simply write `FXRandom()` or provide your own hash.
let fxhash = "ooEe35444PHChgadq3grgeqdUbMCj6cn8JjZCNjGrx4jnDSbtW6"
let rnd = new FXRandom(fxhash)

// random integers between 0 and 10 (exclusive)
let ints = []
for (let i = 0; i < 10; i++) {
  ints.push(rnd.rInt(10))
}
console.log(ints)

// normally distrbuted random numbers with mean 5 and
// standard deviation 0.2
let norms = []
for (let i = 0; i < 10; i++) {
  norms.push(rnd.rNorm(5, 0.2));
}
console.log(norms)

// weighted sampling
let letters = ['a', 'b', 'c', 'd']
let weights = [1, 1, 2, 4]
let chosen = []
for (let i = 0; i < 10; i++) {
  chosen.push(rnd.chooseOneWeighted(letters, weights))
}
console.log(chosen)

// sampling without replacement
chosen = rnd.chooseManyUnique(letters, 3)
console.log(chosen)
```