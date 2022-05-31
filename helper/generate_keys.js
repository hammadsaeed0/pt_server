const crypto = require('crypto')

//for 256bit we use 32byte crypto key
//this will return a buffer of 256 bit key 
// to convert it to hex string we will convert toString('hex')
const key1 = crypto.randomBytes(32).toString('hex')
const key2 = crypto.randomBytes(32).toString('hex')
console.table({key1, key2})