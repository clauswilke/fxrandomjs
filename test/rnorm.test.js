const FXRandom = require('../fxrandom.js');

test('Normal deviates are reproducible with same seed', () => {
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


test('Mean and sd are set correctly', () => {
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