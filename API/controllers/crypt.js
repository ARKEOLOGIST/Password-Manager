var crypto = require('crypto');
//const { callbackify } = require('node:util');

const masterEncryptionKey = crypto.randomBytes(32);
console.log(masterEncryptionKey.toString('hex'));

const salt = crypto.randomBytes(8);
console.log(salt.toString('hex'));

var pass = 'Anishka@123';

var hpass = crypto.pbkdf2Sync(pass, salt, 100000, 16, 'sha512',(err, hashPassword) => {
    if (err) throw err;
});
console.log(hpass.toString('hex')); 
  // var hpass = crypto.pbkdf2(pass, salt, 100000, 16, 'sha512').toString('hex');
//   var mek = crypto.createCipher("aes-128-ccm",hpass).update(masterEncryptionKey, "utf-8", "hex");
//   console.log(mek);