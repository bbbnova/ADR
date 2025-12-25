const crypto = require('crypto');
require('dotenv').config();
// var pkcs7 = require('pkcs7-padding');

const encryptString = (data) => {     
    const algorithm = 'aes-256-cbc'
    const key = crypto.createHash('sha512').update(process.env.SECRET_KEY).digest('hex').substring(0,32);
    const iv = crypto.createHash('sha512').update(process.env.IV).digest('hex').substring(0,16);

    const cipher = crypto.createCipheriv(algorithm, key, iv)
        return Buffer.from(cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
        ).toString('base64');        
}

const decryptString = (encryptedData) => {     
    const algorithm = 'aes-256-cbc'
    const key = crypto.createHash('sha512').update(process.env.SECRET_KEY).digest('hex').substring(0,32);
    const iv = crypto.createHash('sha512').update(process.env.IV).digest('hex').substring(0,16);

    const buff = Buffer.from(encryptedData, 'base64')
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    return (
        decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
        decipher.final('utf8')
    )
}

// function getHash(text) {
//     const data = Buffer.from(text);
//     const hash = crypto.createHash('sha256');
//     hash.update(data);
//     return hash.digest('base64');
// }
// function verifyHash(text, hashValue) {
//     const data = Buffer.from(text);
//     const hash = crypto.createHash('sha256');
//     hash.update(data);
//     return hash.digest('base64') === hashValue;
// }


function getHash(text, saltLength) {
    const salt = crypto.randomBytes(saltLength);
    const data = Buffer.from(text).join(salt);
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return JSON.stringify({hash: hash.digest('base64'), salt: salt.toString('base64')});
}
function verifyHash(text, hashValue) {
    let hashObj = JSON.parse(hashValue);
    const salt = Buffer.from(hashObj.salt, 'base64');
    const data = Buffer.from(text).join(salt);
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('base64') === hashObj.hash;
}




const encrypt = (text, password) => {
    const algorithm = 'aes-256-cfb8';
    
    let saltBytes = crypto.randomBytes(32);
    let passwordBytes = Buffer.from(password, 'utf8');
    
    let keyIvBytes = crypto.pbkdf2Sync(passwordBytes, saltBytes, 50000, 32 + 16, 'sha1')
    let result;
    try {
        let keyBytes = Buffer.copyBytesFrom(keyIvBytes, 0, 32);
        let ivBytes = Buffer.copyBytesFrom(keyIvBytes, 32, 16); 

        const cipher = crypto.createCipheriv(algorithm, keyBytes, ivBytes);    
        cipher.setAutoPadding(false);
        let textBytes = Buffer.from(text, 'utf8');
        // let textBytesPadded = pkcs7.pad(textBytes);
        let enc = [saltBytes, cipher.update(textBytes)];
        enc.push(cipher.final());
        result = Buffer.concat(enc).toString('base64');
    }
    catch(err) {
        console.log("error encrypting: " + err)            
        return '';
    }
    
    return result 
}

const decrypt = (cipherText, password) => {
    const algorithm = 'aes-256-cfb8';
    
    let cipherBytes = Buffer.from(cipherText, 'base64');
    // console.log('cipherBytes: ' + cipherBytes.toString('hex'));

    let saltBytes = Buffer.copyBytesFrom(cipherBytes, 0, 32);
    // console.log('saltBytes: ' + saltBytes.toString('hex'));

    let dataBytes = Buffer.copyBytesFrom(cipherBytes, 32);
    // console.log('dataBytes: ' + dataBytes.toString('hex'));

    // let dataBytesPadded = pkcs7.unpad(dataBytes);
    let passwordBytes = Buffer.from(password, 'utf8');
    // console.log('passwordBytes: ' + passwordBytes.toString('hex'));

    const keyIvBytes = crypto.pbkdf2Sync(passwordBytes, saltBytes, 50000, 32 + 16, 'sha1')
    
    let result;
    try {
        let keyBytes = Buffer.copyBytesFrom(keyIvBytes, 0, 32);
        // console.log('keyBytes: ' + keyBytes.toString('hex'));

        let ivBytes = Buffer.copyBytesFrom(keyIvBytes, 32, 16);
        // console.log('ivBytes: ' + ivBytes.toString('hex'));
        
        const decipher = crypto.createDecipheriv(algorithm, keyBytes, ivBytes);
        decipher.setAutoPadding(false);

        let res1 = decipher.update(dataBytes);
        let res2 = decipher.final();
        let res = Buffer.concat([res1, res2]);
        result = res.toString('utf8');
    }
    catch(err) {
        console.log('error decrypting: ' + err)
        return ''
    }

    return result;    
}


const encryptBrowser = (text, password) => {
    const algorithm = 'aes-256-cbc';
    
    let saltBytes = crypto.randomBytes(32);
    let passwordBytes = Buffer.from(password, 'utf8');
    
    let keyIvBytes = crypto.pbkdf2Sync(passwordBytes, saltBytes, 50000, 32 + 16, 'sha1')
    let result;
    try {
        let keyBytes = Buffer.copyBytesFrom(keyIvBytes, 0, 32);
        let ivBytes = Buffer.copyBytesFrom(keyIvBytes, 32, 16); 

        const cipher = crypto.createCipheriv(algorithm, keyBytes, ivBytes);    
        // cipher.setAutoPadding(false);
        let textBytes = Buffer.from(text, 'utf8');
        // let textBytesPadded = pkcs7.pad(textBytes);
        let enc = [saltBytes, cipher.update(textBytes)];
        enc.push(cipher.final());
        result = Buffer.concat(enc).toString('base64');
    }
    catch(err) {
        console.log(err)
        return 'error';
    }
    
    return result;  
}


const decryptBrowser = (cipherText, password) => {
    const algorithm = 'aes-256-cbc';
    
    let cipherBytes = Buffer.from(cipherText, 'base64');
    // console.log('cipherBytes: ' + cipherBytes.toString('hex'));

    let saltBytes = Buffer.copyBytesFrom(cipherBytes, 0, 32);
    // console.log('saltBytes: ' + saltBytes.toString('hex'));

    let dataBytes = Buffer.copyBytesFrom(cipherBytes, 32);
    // console.log('dataBytes: ' + dataBytes.toString('hex'));

    // let dataBytesPadded = pkcs7.unpad(dataBytes);
    let passwordBytes = Buffer.from(password, 'utf8');
    // console.log('passwordBytes: ' + passwordBytes.toString('hex'));

    let keyIvBytes = crypto.pbkdf2Sync(passwordBytes, saltBytes, 50000, 32 + 16, 'sha1')
    let result;
    try {
        let keyBytes = Buffer.copyBytesFrom(keyIvBytes, 0, 32);
        // console.log('keyBytes: ' + keyBytes.toString('hex'));

        let ivBytes = Buffer.copyBytesFrom(keyIvBytes, 32, 16);
        // console.log('ivBytes: ' + ivBytes.toString('hex'));
        
        const decipher = crypto.createDecipheriv(algorithm, keyBytes, ivBytes);
        // decipher.setAutoPadding(false);

        let res1 = decipher.update(dataBytes);
        let res2 = decipher.final();
        let res = Buffer.concat([res1, res2]);
        result = res.toString('utf8');
    }
    catch(err) {
        return err;
    }

    return result; 
}

module.exports = { encryptString, decryptString, getHash, verifyHash, encrypt, decrypt, decryptBrowser, encryptBrowser }