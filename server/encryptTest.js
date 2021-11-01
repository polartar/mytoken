const encrypt = require('./encrypt');

// test function to test all the functions

async function test() {
    const obj = {    /// JSON file   To be uploaded
        Name : 'AY',
        Email : 'XY',
    };

    const key = await encrypt.generateKey(); // generate key

    const ipfsHash = await encrypt.addfile(obj, key); // Upload the data to ipfs
    console.log(typeof(ipfsHash));
    const data = encrypt.getByHash(ipfsHash, key); // get data from ipfs
    console.log(data);

};

test();
