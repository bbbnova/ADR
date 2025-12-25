async function pbkdf2ImportKey(password)
{
    var enc = new TextEncoder();
    let pwd = enc.encode(password)

    let key = await window.crypto.subtle.importKey(
        "raw", //only "raw" is allowed
        pwd,
        {
            name: "PBKDF2",
        },
        false, //whether the key is extractable (i.e. can be used in exportKey)
        ["deriveKey", "deriveBits"]
    )

    return key;
}

async function cbsImportKey(keyBytes)
{
    let key = await window.crypto.subtle.importKey(
        "raw", 
        keyBytes,
        { name: "AES-CBC", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );

    return key;
}

async function pbkdf2DeriveBits(salt, iterations, algorithm, key, numberOfBits) {
    let bits = await window.crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: iterations,
            hash: {name: algorithm} //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
        },
        key,
        numberOfBits
    );

    return bits;
}

async function decrypt(cipherText, password) {
    let cipherBytes = base64ToArrayBuffer(cipherText);

    let pbkdf2key = await pbkdf2ImportKey(password);
    let salt = cipherBytes.slice(0, 32);
    let dataBytes = cipherBytes.slice(32, cipherBytes.byteLength);
    
    let pbkdf2Bytes = await pbkdf2DeriveBits(salt, 50000, 'SHA-1', pbkdf2key, (32 + 16) * 8);    
          
    let keyBytes = pbkdf2Bytes.slice(0, 32);
    let ivBytes = pbkdf2Bytes.slice(32, 32 + 16);

    // console.log(cipherBytes);
    // console.log(salt);
    // console.log(dataBytes);
    
    let decrypted = await window.crypto.subtle.decrypt(
        {
            name: "AES-CBC",
            iv: ivBytes,
        },
        await cbsImportKey(keyBytes),
        dataBytes
    )

    let dec = new TextDecoder('utf-8');
    return dec.decode(decrypted);
}

async function encrypt(cipherText, password) {
    var enc = new TextEncoder();

    let pbkdf2key = await pbkdf2ImportKey(password);
    let salt = window.crypto.getRandomValues(new Uint8Array(32));

    let pbkdf2Bytes = await pbkdf2DeriveBits(salt, 50000, 'SHA-1', pbkdf2key, (32 + 16) * 8);    
          
    let keyBytes = pbkdf2Bytes.slice(0, 32);
    let ivBytes = pbkdf2Bytes.slice(32, 32 + 16);
    
    let encrypted = await window.crypto.subtle.encrypt(
        {
            name: "AES-CBC", 
            iv: ivBytes,
        },
        await cbsImportKey(keyBytes), //from generateKey or importKey above
        enc.encode(cipherText) //ArrayBuffer of the data
    )

    var base64String = arrayBufferToBase64(appendBuffer(salt, encrypted));

    return base64String;
}

async function getHash(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hash = await window.crypto.subtle.digest("SHA-256", data);
    return arrayBufferToBase64(hash);
}

async function verifyHash(data, hash) {
    const dataBytes = base64ToArrayBuffer(data);
    const dataHashBytes = await window.crypto.subtle.digest("SHA-256", dataBytes);
    return arrayBufferToBase64(dataHashBytes) === hash;
}

function appendBuffer( buffer1, buffer2 ) {
    var tmp = new Uint8Array( buffer1.byteLength + buffer2.byteLength );
    tmp.set( new Uint8Array( buffer1 ), 0 );
    tmp.set( new Uint8Array( buffer2 ), buffer1.byteLength );
    return tmp.buffer;
}

function arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

function base64ToArrayBuffer(base64) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}