const FXRandom = require('../fxrandom.js');

test('Random numbers are reproducible with same seed', () => {
  let hash = 'ooRN7Ry2HUr4WQVYVGFxHfFEAhk4kNaga5DojrwYbX5G6oTjHp8'
  let rnd = new FXRandom(hash, quiet = true)
  let x = []
  for (let i=0; i<10; i++) {
    x.push(rnd.fxrand())
  }
  rnd.setSeed(hash, quiet = true)
  let y = []
  for (let i=0; i<10; i++) {
    y.push(rnd.fxrand())
  }
  expect(x).toEqual(y)
});