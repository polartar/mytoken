const Tokenizer = require('./models/tokenizer');
const sgMail = require('@sendgrid/mail');
const sendMail = require('./sendMail')(sgMail);
const { isTestPromoCode } = require('./controllers/checkout');
// Load contract and web3
const SelfTokenizerContract = require('../client/src/contracts/SelfTokenizer.json');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/2db28c77d27546b4b149b70bc524a9c5'));
const Tx = require('ethereumjs-tx').Transaction;
// Set Wallet key
const infuraSecret = new Buffer.from('0x79B9AAC569C9500F84A093920EE08BC278DC4E6FCA62CDBC97620F0B4E0CC21F'.substring(2,66), 'hex');
// Set contract proxy address
const proxy = "0xeD7a329cd01822cF9fC001314451E2B5E51089D0";

web3.eth.accounts.wallet.add('0x79B9AAC569C9500F84A093920EE08BC278DC4E6FCA62CDBC97620F0B4E0CC21F');

const GasMultiplier = process.env.GAS_MULTIPLIER || 1;

// IPFS module
const ipfs = require('./encrypt');

// Encryption key
const key = ipfs.generateKey();
console.log('Key', key);

// Token creation function
const prepareToken = async(
  _title,
  _symbol,
  _supply,
  _ownerETHAddress,
  _assetInfo,
  _assetType,
  _assetId,
  _hodlersLimit,
  _limitNumber,
  _allAccredited,
  _whitelist,
  _ipfsHash,
  testMode,
) => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = SelfTokenizerContract.networks[networkId];
  const instance = await new web3.eth.Contract(
    SelfTokenizerContract.abi, proxy
  );
  // Covert token supply to Wei
  const adjustedSupply = await web3.utils.toWei(_supply.toString(), 'ether');
  let tokenized = '';
  // Admin address
  const adminAddress = '0x55D9049d8b83F7CDE627AE6d8cAE9676692fAfe9';
  try {
    // Initialize method
    tokenized = instance.methods.tokenizeAsset(
                        _title,
                        _symbol,
                        adjustedSupply,
                        _ownerETHAddress,
                        _assetInfo,
                        _assetType,
                        _assetId,
                        _hodlersLimit,
                        _limitNumber,
                        _allAccredited,
                        _whitelist,
                        _ipfsHash,
                      );
    // Get tranaction count
    const txCount = await web3.eth.getTransactionCount(adminAddress, 'pending');
    // Get gas price
    const gP = await web3.eth.getGasPrice();
    const gasPrice = testMode ? 1 : Number(gP)*GasMultiplier;
    console.log('Gas Price...', gasPrice);
    // Get latest block gas limit
    const gL = await web3.eth.getBlock('latest');
    const gasLimit = gL.gasLimit;
    console.log('Latest Gas Limit...', gasLimit);
    // Construct tranasction data
    const txData = {
      nonce: web3.utils.toHex(txCount),
    	gasPrice: web3.utils.toHex(gasPrice),
    	gasLimit: web3.utils.toHex(6200000),
    	to: proxy,
    	data: tokenized.encodeABI()
    }
    web3.eth.accounts.wallet.add('0x79B9AAC569C9500F84A093920EE08BC278DC4E6FCA62CDBC97620F0B4E0CC21F')
    const acc = web3.eth.accounts.privateKeyToAccount('0x79B9AAC569C9500F84A093920EE08BC278DC4E6FCA62CDBC97620F0B4E0CC21F').address
    web3.eth.getBalance(acc).then(x => console.log("Balance: ", x.toString()))
    
    // Set and sign tranaction
    // const tx = new Tx({ ...txData, nonce: web3.utils.toHex(txCount) }, { chain: 'rinkeby' });
    const tx = new Tx( txData, { chain: 'mainnet' });
    tx.sign(infuraSecret);
    //console.log('Signed tx....', tx);
    // Seralize tx
    const seralizedTx = `0x${tx.serialize().toString('hex')}`;
    console.log('Seralized tx...', seralizedTx);
    return seralizedTx;
  } catch(error) {
    console.error(error);
    throw error;
  };
};

const sendSignedTransaction = (seralizedTx) => {
  return web3.eth.sendSignedTransaction(seralizedTx);
}

const getCreatedToken = async (_ownerETHAddress) => {
  try {
    const instance = await new web3.eth.Contract(
      SelfTokenizerContract.abi, proxy
    );

    // Get created token addresses
    const createdTokens = await instance.methods.getTokenAddresses(_ownerETHAddress);
    console.log('Created Token Addresses...', createdTokens);
    return createdTokens;
  } catch (err) {
    throw err;
  }
}

const getTransactionReceipt = async (transactionHash) => {
  if (!transactionHash) {
    console.error('getTransactionReceipt: No transaction Hash');
    return null;
  }
  try {
    const response = await web3.eth.getTransactionReceipt(transactionHash);
    return response;
  } catch (err) {
    throw err;
  }
}

const updateStatus = async (_tokenizer, status, more) => {
  try {
    const tokenizer = await Tokenizer.findOne({'checkoutDetails.txn_id': _tokenizer.checkoutDetails.txn_id}).exec();
    tokenizer.status = status;

    if( more ) {
      for (const [key, value] of Object.entries(more)) {
        tokenizer[key] = value;
      }
    }
    await tokenizer.save();
  } catch (e) {
    console.error(`Error while updating tokenizer status ${_tokenizer.checkoutDetails.txn_id}`);
    console.error(e);
  }
}

const handleIpfsAddFile = (tokenizer) => {
  const userDetails = {
    firstName: tokenizer.firstName,
    lastName: tokenizer.lastName,
    ownerCompany: tokenizer.ownerCompany,
    email: tokenizer.email,
    companyPhone: tokenizer.companyPhone,
    website: tokenizer.website
  };

  console.log(`Adding ipfs file for ${tokenizer.paymentDetails.txn_id}`);
  tokenizer.status = 'ADDING_IPFS_FILE';

  (async () => {
    try {
      const ipfsHash = await ipfs.addfile(userDetails, key);
      await updateStatus(tokenizer, 'ADDED_IPFS_FILE', { ipfsHash });
    } catch (err) {
      console.error(`Error adding ipfs file for ${tokenizer.paymentDetails.txn_id}, retrying in 5 secs`);
      console.error(err);
      setTimeout(() => handleIpfsAddFile(tokenizer), 5000);
    }
  })();
};

const handleCreateToken = (tokenizer) => {
  const hLim = tokenizer.holderLimit !== 'No';

  console.log(`Creating token for ${tokenizer.paymentDetails.txn_id}`);
  tokenizer.status = 'PREPARING_TOKEN';

  (async () => {
    try {
      const seralizedTx = await prepareToken(
        tokenizer.title,
        tokenizer.symbol,
        Number(tokenizer.supply),
        tokenizer.ownerETHAddress,
        tokenizer.assetInfo,
        tokenizer.assetType,
        tokenizer.assetId,
        hLim,
        Number(tokenizer.limitNumber),
        tokenizer.allAccredited,
        tokenizer.whitelist,
        tokenizer.ipfsHash,
        isTestPromoCode(tokenizer.promoCode),
      );

      await updateStatus(tokenizer, 'CREATING_TOKEN');
      sendSignedTransaction(seralizedTx)
      .on('transactionHash', async (transactionHash) => {
        console.log('transactionHash', transactionHash);
        await updateStatus(tokenizer, 'CREATED_TOKEN', { transactionHash });
      })
      .on('receipt', async (receipt) => {
        console.log('receipt', receipt);
        await updateStatus(tokenizer, 'CREATED_TOKEN', { receipt });
      });

    } catch (err) {
      console.error(`Error creating token for ${tokenizer.paymentDetails.txn_id}, retrying in 5 secs`);
      console.error(err);
      setTimeout(() => handleCreateToken(tokenizer), 5000);
    }
  })();
}

const handleCreatedTokenStatus = (tokenizer) => {
  console.log(`Check contract address for ${tokenizer.paymentDetails.txn_id}`);

  (async () => {
    try {
      const receipt = await getTransactionReceipt(tokenizer.transactionHash);
      if (receipt && receipt.logs && receipt.logs.length) {
        const contractLog = receipt.logs.find(l => l.address.toLowerCase() !== receipt.to.toLowerCase());
        const contractAddress = contractLog && contractLog.address || null;
        const status = contractAddress ? 'CHECKED_CONTRACT_ADDRESS' : 'CHECK_CONTRACT_ADDRESS';
        await updateStatus(tokenizer, status, { receipt, contractAddress });
      }
    } catch (err) {
      console.error(`Error checking contract address for ${tokenizer.paymentDetails.txn_id}`);
      console.error(err);
    }
  })();
}

const handleSendEmail = (tokenizer) => {
  console.log(`Sending email for ${tokenizer.paymentDetails.txn_id}`);
  tokenizer.status = 'SENDING_EMAIL';

  (async () => {
    try {
      await sendMail.sendConfirmationEmail(tokenizer.email, {
        title: tokenizer.title,
        supply: tokenizer.supply,
        address: tokenizer.ownerETHAddress,
        contract: tokenizer.contractAddress,
        tx: tokenizer.transactionHash,
      });
      tokenizer.emailSent.confirmation = true;
    } catch (err) {
      console.error(`Error sending email for ${tokenizer.paymentDetails.txn_id}, not retrying`);
    }
    await updateStatus(tokenizer, 'DONE');
    console.log(`Contract Creation DONE for ${tokenizer.paymentDetails.txn_id}`);
  })();
}

const changeStatus = (status) => (tokenizer) => tokenizer.status = status;

const ServerRebootMap = {
  ADDING_IPFS_FILE: handleIpfsAddFile,
  PREPARING_TOKEN: handleCreateToken,
  SENDING_EMAIL: handleSendEmail,
};

const NormalPollMap = {
  ADD_IPFS_FILE: handleIpfsAddFile,
  ADDED_IPFS_FILE: changeStatus('CREATE_TOKEN'),
  CREATE_TOKEN: handleCreateToken,
  CREATED_TOKEN: changeStatus('CHECK_CONTRACT_ADDRESS'),
  CHECK_CONTRACT_ADDRESS: handleCreatedTokenStatus,
  CHECKED_CONTRACT_ADDRESS: changeStatus('SEND_EMAIL'),
  SEND_EMAIL: handleSendEmail,
};

let serverReboot = true;
const pollTokenCreation = async () => {
  try {
    const tokenizers = await Tokenizer.find({
      $and:[
        { status: { $exists: true } },
        { status: { $nin: ['WAITING_PAYMENT'] } },
      ]
    }).exec();
    const HandleMap = serverReboot ? ServerRebootMap : NormalPollMap;

    if (tokenizers.length > 0) {
      for (const tokenizer of tokenizers) {
        const handle = HandleMap[tokenizer.status];
        if (handle) {
          handle(tokenizer);
          await tokenizer.save();
        }
      }
    }

    serverReboot = false;
  } catch(err) {
    console.error('Failed to poll status');
    console.error(err);
  }
}

const startPolling = () => setInterval(pollTokenCreation, 5000);

const beginTokenCreation = (tokenizer) => {
  tokenizer.status = 'ADD_IPFS_FILE';
};

module.exports = { beginTokenCreation, startPolling };
