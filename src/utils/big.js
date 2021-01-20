const { Buffer } = require("safe-buffer")

module.exports = {
  numToBuf(n) {
    let base = BigInt(16)
    let array = []
    let map = {
      10: 'a',
      11: 'b',
      12: 'c',
      13: 'd',
      14: 'e',
      15: 'f'
    }
    while (n > 0) {
      res = n % base
      n = n / base
      if (res >= 10) {
        res = map[res]
      }
      array.push(res.toString())
    }
    array.reverse()
    return Buffer.from(array.join(""), 'hex');
    // return array.join("");
  },
  bufToNum(buf) {
    t = 0;
    buf = buf.reverse();
    buf.forEach((item, k) => {
      t += item * 256 ** k
    })
    return t;
  },
  bufToStr(buf) {
    s = ''
    buf.forEach(item => {
      c = item.toString('16');
      if (c.length == 1) {
        c = "0" + c;
      }
      s += c;
    })
    return s;
  }
}

