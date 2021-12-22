/**
 * Random number generator class for use with fxhash.
 */
module.exports = class FXRandom {
  /**
   * Set up a new random number generator, either with defined hash or with
   * random hash.
   * @param {string} fxhash - The input hash. If not provided, a random
   * hash will be generated.
   * @param {boolean} quiet - Should hash be output to the console?
   */
  constructor (fxhash = undefined, quiet = false) {
    this.setSeed(fxhash, quiet)
  }
  
  /** 
   * Re-initialize the random number generator with a new seed hash.
   */
  setSeed (fxhash = undefined, quiet = false) {
    // The implementation for this function was taken from
    // the fxhash snippet in the webpack boilerplate,
    // with minor edits:
    // https://github.com/fxhash/fxhash-webpack-boilerplate
    // Code by ciphrd/fxhash, licensed under MIT
    let alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"

    if (fxhash === undefined) {
      fxhash = "oo" + Array(49).fill(0).map(_=>alphabet[(Math.random()*alphabet.length)|0]).join('');
      if (!quiet) {
        console.log("New FXRandom object without specified input hash. Using hash:",   fxhash)     
      }
    } else {
      if (!quiet) {
        console.log("New FXRandom object with input hash:", fxhash)
      }
    }
    this.fxhash = fxhash
    
    let b58dec = (str) => str.split('').reduce((p, c, i) => p + alphabet.indexOf(c) * (Math.pow(alphabet.length, str.length-i-1)), 0)
    let fxhashTrunc = fxhash.slice(2)
    let regex = new RegExp(".{" + ((fxhash.length/4)|0) + "}", 'g')
    let hashes = fxhashTrunc.match(regex).map(h => b58dec(h))
    let sfc32 = (a, b, c, d) => {
      return () => {
        a |= 0; b |= 0; c |= 0; d |= 0
        var t = (a + b | 0) + d | 0
        d = d + 1 | 0
        a = b ^ b >>> 9
        b = c + (c << 3) | 0
        c = c << 21 | c >>> 11
        c = c + t | 0
        return (t >>> 0) / 4294967296
      }
    }
    
    // This creates a function returning a uniform random number between 0 and 1 
    this.fxrand = sfc32(...hashes)
    
    // Initialize 
    this.rnorm_has_return = false
    this.rnorm_return_v = 0.0
  }
  
  /**
   * Generate a uniformly distributed random number between `min` (inclusive) 
   * and `max` (exclusive).
   */
  rUnif (min = 0, max = 1) {
    return min + (max - min) * this.fxrand()
  }

  /**
   * Generate a random integer between 0 (inclusive) and `n` (exclusive).
   */
  rInt (n = 100) {
    return Math.floor(n * this.fxrand())
  }

  /**
   * Generate a standard normal random number with zero mean and unit variance.
   */
  rStandardNorm () {
    // polar Box-Mueller method
    // https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform#Polar_form
    if (this.rnorm_has_return) { 
      this.rnorm_has_return = false
      return this.rnorm_return_v
    }
    let u = 2 * this.fxrand() - 1
    let v = 2 * this.fxrand() - 1
    let s = u * u + v * v
    if (s == 0 || s > 1) {
      return this.rStandardNorm()
    }
    let c = Math.sqrt(-2 * Math.log(s) / s)
    this.rnorm_return_v = v * c; // cache this for next function call for efficiency
    this.rnorm_has_return = true;
    return u * c;
  }

  /**
   * Generate a standard normal random number with zero mean and unit variance.
   */
  rNorm (mean = 0, sd = 1) {
    return mean + sd * this.rStandardNorm()
  }

  /**
   * Return a randomly chosen value from the given array. All elements are 
   * chosen with equal probability.
   */
  chooseOne (array) {
    return array[this.rInt(array.length)]
  }

  /**
   * Return a randomly chosen value from the given array. Elements are 
   * chosen with probability in proportion to the given weights.
   */
  chooseOneWeighted (array, weights) {
    return this.chooseManyWeighted (array, weights, 1)[0]
  }

  /**
   * Returm `n` randomly chosen elements from the given array,
   * with resampling. Elements are chosen with probability in
   * proportion to the given weights.
   */
  chooseManyWeighted (array, weights, n) {
    // create cumulative normalized weights
    let l = weights.length
    let cumsum = new Array(l)
    let sum = 0
    for (let i = 0; i<l; i++) {
      sum += weights[i]
      cumsum[i] = sum
    }
    for (let i = 0; i<l; i++) {
      cumsum[i] /= sum
    }
    
    // now choose random values according to probability distribution
    let result = new Array(n)
    for (let i = 0; i < n; i++) {
      let x = this.fxrand()
      let j = 0
      while (x > cumsum[j] && j < l - 1) {
        j += 1
      }
      result[i] = array[j]
    }
    return result
  }

  
  /**
   * Return `n` randomly chosen elements from the given array,
   * with the condition that all chosen elements are unique (i.e.,
   * chosen without resampling). Elements are 
   * chosen with uniform probability.
   */
  chooseManyUnique (array, n) {
    // copy input array
    let l = array.length
    let input = new Array(l)
    for (let i = 0; i<l; i++) {
      input[i] = array[i]
    }

    // now uniformly choose unique elements as long as we have any
    let output = new Array(n)
    let j = 0
    while (j < n) {
      if (l > 0) {
        let k = this.rInt(l)
        output[j] = input[k]
        input[k] = input[l-1]
        l -= 1
      } else {
        output[j] = undefined
      }
      j += 1
    }
    return output
  }
}
