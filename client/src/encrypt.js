
//  encryption and decryption of JSON file using symmetric crptography.

// To run this file using nodejs
// In Terminal type "node encrypt.js"


var nacl = require('tweetnacl') 
var util = require('tweetnacl-util')
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('42cda91c3ff44ad8d752', '010a6f07b72d06ba5f93f3665d95df92caf5de226a224a6d4e114b3b18371ad6');
const IPFS = require("nano-ipfs-store");
const ipfs = IPFS.at("https://ipfs.infura.io:5001");

 


const newNonce = () => nacl.randomBytes(nacl.secretbox.nonceLength);

const generateKey = () => util.encodeBase64(nacl.randomBytes(nacl.secretbox.keyLength)); // will make constant key 
                                                                                        //before testing with real data

// Will encrypt the json file using key, pass(json, key) to get the encrypted file

const encrypt = (json, key) => {
  const keyUint8Array = util.decodeBase64(key);

  const nonce = newNonce();
  const messageUint8 = util.decodeUTF8(JSON.stringify(json));
  const box = nacl.secretbox(messageUint8, nonce, keyUint8Array);

  const fullMessage = new Uint8Array(nonce.length + box.length);
  fullMessage.set(nonce);
  fullMessage.set(box, nonce.length);

  const base64FullMessage = util.encodeBase64(fullMessage);
  return base64FullMessage;
};

// if authenticated then only decrypt else error

// Will decrypt the encrytped file using key, pass(encrpted, key)

const decrypt = (messageWithNonce, key) => {
  const keyUint8Array = util.decodeBase64(key);
  const messageWithNonceAsUint8Array = util.decodeBase64(messageWithNonce);
  const nonce = messageWithNonceAsUint8Array.slice(0, nacl.secretbox.nonceLength);
  const message = messageWithNonceAsUint8Array.slice(
    nacl.secretbox.nonceLength,
    messageWithNonce.length
  );

  const decrypted = nacl.secretbox.open(message, nonce, keyUint8Array);

  if (!decrypted) {
    throw new Error("Could not decrypt message");
  }

  const base64DecryptedMessage = util.encodeUTF8(decrypted);
  return JSON.parse(base64DecryptedMessage);
};


/*pinata.testAuthentication().then((result) => {
    //handle successful authentication here
    //console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});*/

async function addfile(data, key) {

        // Upload data to IPFS
        console.log("called\n");


        const encrypted = encrypt(data, key);

        console.log('original data : ', data);

        console.log('encrypted data : ', encrypted);

        const ipfsHash = await ipfs.add(encrypted);  

        console.log('IPFS Hash : ' , ipfsHash)

        pinata.pinByHash(ipfsHash).then((result) => {
            //handle results here
            //console.log(result);
        }).catch((err) => {
            //handle error here
            //console.log(err);
        });

        return ipfsHash;
  
}; 


async function getByHash(ipfsHash, key) {

        console.log("ok");

        const data = await ipfs.cat(ipfsHash);

        const decrypted = decrypt(data, key);

        console.log(decrypted);

        return decrypted;

};


// test function to test all the functions

async function test() {
    const obj = {    /// JSON file   To be uploaded
    "Name" : "AY",
    "Email" : "XY"
    };

    const key = await generateKey(); // generate key

    const ipfsHash = await addfile(obj, key); // Upload the data to ipfs

    const data = getByHash(ipfsHash, key); // get data from ipfs


};

test();



