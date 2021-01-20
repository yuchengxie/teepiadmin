var createECDH = require('create-ecdh');
var CryptoJS = require('crypto-js');
var sha256 = require('crypto-js/sha256');
const big = require('./big')
const ecdh = createECDH('secp256k1');

const _platform_pubkey = Buffer.from('03f3fdeb261719c6ffcb9ed52bd3620a01b435c3e112cddf8cc408983156d02e8a', 'hex');
const bigN = 78509330464762671119978066412230577678653495098459785631239544285600861595308n;

function gen_ecdh_key(pubkey33) {
  // ecdh.setPrivateKey(big.numToBuf(bigN));
  ecdh.generateKeys();
  let pubKeyPoint = ecdh.getPublicKey();
  let nonce_x = pubKeyPoint.slice(1, 33);
  let nonce_y = pubKeyPoint.slice(33, 65);
  let l_nonce_y = nonce_y.slice(-1);
  let flag = l_nonce_y[0] & 0x01;
  let targ_x = ecdh.computeSecret(pubkey33);
  return [flag, nonce_x, targ_x];
}

function cryptoEncrypt(prv, iv, word) {
  var key = CryptoJS.enc.Hex.parse(prv.toString('hex'));
  var iv = CryptoJS.enc.Hex.parse(iv.toString('hex'));
  var encrypted = '';
  var srcs = CryptoJS.enc.Hex.parse(word.toString('hex'));
  encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });
  return encrypted.ciphertext.toString();
}

// function cryptoEncrypt(prv, iv, word) {
//   console.log(word);
//   var key = CryptoJS.enc.Hex.parse(prv.toString('hex'));
//   var iv = CryptoJS.enc.Hex.parse(iv.toString('hex'));
//   var encrypted = '';
//   if (typeof (word) == 'string') {
//     // word += '00000000000000000000'
//     var srcs = CryptoJS.enc.Hex.parse(word);
//     // srcs += '\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
//     encrypted = CryptoJS.AES.encrypt(srcs, key, {
//       iv: iv,
//       mode: CryptoJS.mode.CBC,
//       padding: CryptoJS.pad.ZeroPadding
//     });
//   } else if (typeof (word) == 'object') {//对象格式的转成json字符串
//     data = JSON.stringify(word);
//     var srcs = CryptoJS.enc.Utf8.parse(data);
//     encrypted = CryptoJS.AES.encrypt(srcs, key, {
//       iv: iv,
//       mode: CryptoJS.mode.CBC,
//       padding: CryptoJS.pad.ZeroPadding
//     })
//   }
//   return encrypted.ciphertext.toString();
// }

function encryptMsg(k_iv, msg) {
  return cryptoEncrypt(k_iv.slice(0, 16), k_iv.slice(16, 32), msg);
}

function genCipherByWord(phone, secret) {
  //16进制字符串
  if (typeof phone === 'string') {
    phone = Buffer.from(phone)
  }
  let r = gen_ecdh_key(_platform_pubkey);
  let flag = r[0];
  let nonce_x = r[1];
  let k_iv = r[2];
  let sha_secret = sha256(secret).toString();
  let kong = Buffer.from('00', 'hex');
  sha_secret = Buffer.from(sha_secret, 'hex');
  // let msg = phone + '00' + sha_secret;
  let buf_msg = Buffer.concat([phone, kong, sha_secret]);
  let encrypt = encryptMsg(k_iv, buf_msg);
  let cipher = nonce_x.toString('hex') + encrypt;
  return [flag, cipher];
}


function genCipherByPsw(_dev_pubkey33, psw, old_psw) {
  let msg;
  if (typeof psw === 'string') {
    psw = Buffer.from(psw)
  }
  if (old_psw && typeof old_psw === 'string') {
    old_psw = Buffer.from(old_psw)
    let kong = Buffer.from('00', 'hex');
    msg = Buffer.concat([psw, kong, old_psw])
  } else {
    msg = psw;
  }
  if (typeof _dev_pubkey33 === 'string') {
    _dev_pubkey33 = Buffer.from(_dev_pubkey33, 'hex')
  }
  let r = gen_ecdh_key(_dev_pubkey33);
  let flag = r[0];
  let nonce_x = r[1];
  let k_iv = r[2];

  console.log('genCipherByPsw msg:', msg);
  let encrypt = encryptMsg(k_iv, msg);
  let cipher = nonce_x.toString('hex') + encrypt;
  console.log('cipher:', cipher);
  return [flag, cipher];
}

function genCipherExport(psw, idx, dev_pub, friend_pub33) {//默认用平台公钥
  psw = Buffer.from(psw)
  friend_pub33 = Buffer.from(friend_pub33, 'hex');
  dev_pub = Buffer.from(dev_pub, 'hex');
  idx = new Buffer([idx])
  let r = gen_ecdh_key(dev_pub);
  let flag = r[0];
  let nonce_x = r[1];
  let k_iv = r[2];

  let kong = Buffer.from('00', 'hex');
  let msg = Buffer.concat([psw, kong, idx, friend_pub33])
  console.log('msg:', msg.toString('hex'));
  // ok 313233343536000003f3fdeb261719c6ffcb9ed52bd3620a01b435c3e112cddf8cc408983156d02e8a
  // ng 313233343536000003f3fdeb261719c6ffcb9ed52bd3620a01b435c3e112cddf8cc408983156d02e8a
  console.log('k_iv:', k_iv, k_iv.toString('hex'));
  //2a555ecf7c17af15a95dff1479e7bbdfd446dcb78fd5ea79c9ff373d14c01703
  //ok 3906048710934cbb9770c0dc4f2c3b8aece9f18c25e0bdd7ddca1775099653b0
  let encrypt = encryptMsg(k_iv, msg);

  let cipher = nonce_x.toString('hex') + encrypt;
  console.log('cipher:', cipher);
  // ng
  //   1d0f91314605fcdf3325893d685d6838fc15525d3f3bb9a5c3db2359aeedc10be62b40504571fa2191b8e576e16eea3733398fe47a07349fb24bf4bacb748f97833735351fea8997b6888ee2891f3caa
  return [flag, cipher];
  //1d0f91314605fcdf3325893d685d6838fc15525d3f3bb9a5c3db2359aeedc10b e62b40504571fa2191b8e576e16eea3733398fe47a07349fb24bf4bacb748f97833735351fea8997b6888ee2891f3caa

  // 1d0f91314605fcdf3325893d685d6838fc15525d3f3bb9a5c3db2359aeedc10b 0b0a529272d12753cfdfcafc116e5b09ab2a56ff85b4ed227a0d25e98f77d2e91f87025359adf1bf82f0b010afb949e1

}

function str2utf8(str) {
  let encoder = new TextEncoder('utf-8');
  let arr = encoder.encode(str);
  return Buffer.from(arr);
}

module.exports = {
  _platform_pubkey,
  genCipherByWord,
  genCipherByPsw,
  genCipherExport,
}

// 测试二
// let psw = '\x31\x32\x33\x34\x35\x36\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00';
// let psw = '123456';
// genCipherByPsw(psw, _platform_pubkey.toString('hex'));


// 测试一
// r = gen_ecdh_key(_platform_pubkey);
// nonce_x = r[1];
// let k_iv = r[2];
// let flag = r[0];
// // let word = sha256('今晚打老虎').toString();
// let word = sha256('今晚打老虎').toString();//348ee11ff1af0dbf497e918cb648b46a2762241a3771405f2b3cd4a14dea0c2f
// word = Buffer.from(word, 'hex')
// console.log('word:', word, word.length);
// phone = '18825239857'
// phone = Buffer.from(phone);
// console.log('phone:', phone);
// let _k = Buffer.from('00','hex');
// let c = Buffer.concat([phone, _k, word]);
// console.log("phone+word:", c, c.toString('hex'));
// console.log('k_iv:', k_iv);

// let en = cryptoEncrypt(k_iv.slice(0, 16), k_iv.slice(16, 32), c);
// console.log(en);


// js/p fe8d643c87665741d7f2c13cdd9a0780f63e8b0e97049dd945d6dd557c22db15 08c2a677a8bf2572e58821af01896c71
// p    fe8d643c87665741d7f2c13cdd9a0780f63e8b0e97049dd945d6dd557c22db15 e0a514659e26934daa024b3063a519b6