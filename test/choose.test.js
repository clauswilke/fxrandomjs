const FXRandom = require('../fxrandom.js');

// helper function to find unqiue values
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

test('Unweighted choice produces correct probabilities', () => {
  let hash = 'ooZ3Xz45G2WtXcPZVDLHwaLvypBAXaveeKtws2izTH5DjejCTmm'
  let rnd = new FXRandom(hash, quiet = true)
  let result = [0, 0, 0, 0]
  let n = 100000
  for (let i = 0; i<n; i++) {
    let z = rnd.chooseOne([0, 1, 2, 3])
    result[z] += 1
  }
  for (let i = 0; i<4; i++) {
    expect(result[i]/n).toBeCloseTo(0.25, 2)
  }
});

test('Weighted choice produces correct probabilities', () => {
  let hash = 'oovebLE9NhBjNn2NkxL4EZL9JTUdVFDXGZ1BoTjH6vqf9fTqcVz'
  let rnd = new FXRandom(hash, quiet = true)
  let result = [0, 0, 0, 0]
  let weights = [1/9, 2/9, 2/9, 4/9]
  let n = 100000
  for (let i = 0; i<n; i++) {
    let z = rnd.chooseOneWeighted([0, 1, 2, 3], weights)
    result[z] += 1
  }
  for (let i = 0; i<4; i++) {
    expect(result[i]/n).toBeCloseTo(weights[i], 2)
  }
});

test("Weights don't need to be normalized", () => {
  let hash = 'ooyAm2eXy1vVg2UgGpSetx4Bx4junkcNyvzTR7eFsqtnsGhZWXM'
  let rnd = new FXRandom(hash, quiet = true)
  let result = [0, 0, 0, 0]
  let weights = [1, 2, 2, 4]
  let n = 100000
  for (let i = 0; i<n; i++) {
    let z = rnd.chooseOneWeighted([0, 1, 2, 3], weights)
    result[z] += 1
  }
  for (let i = 0; i<4; i++) {
    expect(result[i]/n).toBeCloseTo(weights[i]/9, 2)
  }
});

test('Weighted many choice equals repeated one choice', () => {
  let hash = 'oodbg91VadkJU2s5tZJbfn4ss1WqAyzbGsgeuD4Gi9gwnMJ1iCW'
  let rnd = new FXRandom(hash, quiet = true)
  let letters = ['a', 'b', 'c', 'd']
  let weights = [1/9, 2/9, 2/9, 4/9]
  let result = []
  for (let i = 0; i<10; i++) {
    result.push(rnd.chooseOneWeighted(letters, weights))
  }
  rnd.setSeed(hash, quiet = true)
  expect(result).toEqual(rnd.chooseManyWeighted(letters, weights, 10))
});

test('Unique choices are unique', () => {
  let hash = 'ooHghkbjaoghfP5hJTMubuRFrNMcb3MnS6sdHX1xwh66oEzPq3H'
  let rnd = new FXRandom(hash, quiet = true)
  
  let choice = rnd.chooseManyUnique(['a', 'b', 'c', 'd'], 3)
  let choice_filtered = choice.filter(onlyUnique)
  expect(choice).toEqual(choice_filtered)
});

test('Unique choices for n>l work', () => {
  let hash = 'oot7Kt1REHduntveXxQDHqHDzeKoN4FUtWxyUZ9DTobWQz7Lnhe'
  let rnd = new FXRandom(hash, quiet = true)
  
  let choice = rnd.chooseManyUnique(['a', 'b', 'c', 'd'], 6)
  let remainder = choice.slice(4)
  expect(remainder).toEqual([undefined, undefined])
});

test("Unique choices are uniformly distributed", () => {
  let hash = 'oo8vvQvToMdwUzsvW6ywLtYZc52TKo3VCNmH8Zi9mNzDqCtXymV'
  let rnd = new FXRandom(hash, quiet = true)
  let result = [0, 0, 0, 0]
  let n = 100000
  for (let i = 0; i<n; i++) {
    let choice = rnd.chooseManyUnique([0, 1, 2, 3], 3)
    for (z of choice) {
      result[z] += 1
    }
  }
  for (let i = 0; i<4; i++) {
    expect(result[i]/(3 * n)).toBeCloseTo(1/4, 2)
  }
});
