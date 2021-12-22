const FXRandom = require('../fxrandom.js');

test('Normal variates are reproducible with same seed', () => {
  let hash = 'oooUhs5dxLWevW1juwRAZNB5Fqwihxdyq6Gd17LcbQMSjdBDLeu'
  let rnd = new FXRandom(hash, quiet = true)
  let x = []
  for (let i=0; i<10; i++) {
    x.push(rnd.rNorm())
  }
  rnd.setSeed(hash, quiet = true)
  let y = []
  for (let i=0; i<10; i++) {
    y.push(rnd.rNorm())
  }
  expect(x).toEqual(y)
});


test('Mean and sd scale standard normal variates', () => {
  let hash = 'ooAAzjVvrc8xEU1FtwpYNQ87Wm2sDLoG6paMzr1PFiD6wGcExqw'
  let mean = 5
  let sd = 3
  let rnd = new FXRandom(hash, quiet = true)
  let x = []
  for (let i=0; i<10; i++) {
    x.push(mean + sd * rnd.rStandardNorm())
  }
  rnd.setSeed(hash, quiet = true)
  let y = []
  for (let i=0; i<10; i++) {
    y.push(rnd.rNorm(mean, sd))
  }
  expect(x).toEqual(y)
});


test('Normally distributed random variates have correct mean', () => {
  let hash = 'ooARgVMfTPEA91FCQE7xGrBzQ1LRvtEd7T7igwLyDUBYjg6ejaJ'
  let mean = 9.3
  let sd = 2.5
  let rnd = new FXRandom(hash, quiet = true)
  let n = 100000
  let sum = 0
  for (let i=0; i<n; i++) {
    sum += rnd.rNorm(mean, sd)
  }
  expect(sum/n).toBeCloseTo(mean, 2)
});


test('Exponentially distributed random variates have correct mean', () => {
  let hash = 'ooyKsiQPvR1j1HJSyP7djQ6irRasTReT9G1XHUk1jRkDbwZHeqg'
  let mean = 2.4
  let rnd = new FXRandom(hash, quiet = true)
  let n = 100000
  let sum = 0
  for (let i=0; i<n; i++) {
    sum += rnd.rExp(mean)
  }
  expect(sum/n).toBeCloseTo(mean, 2)
});

