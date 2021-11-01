/* Test file for SelfTokenizer solidity contract */

const { token } = require("morgan");

// Import artifacts
const SelfTokenizer = artifacts.require("./SelfTokenizer.sol");
const SelfTokenizerRegistry = artifacts.require("SelfTokenizerRegistry");
const VerificatioList = artifacts.require("VerificationList");
const Tokenize = artifacts.require("Tokenize");

contract("SelfTokenizer", function (accounts) {
  // Assign Accounts and Variables
  const client = accounts[2];
  const admin = accounts[0];
  //  const admin = '0x49f08106444730880c2A6796f84aaDAc2Fa92cFf';
  //  const fee = web3.utils.toBN(250000000000000000);

  const tokenName = "Burj Khalifa";
  const tokenSymbol = "BKH";
  const tokenSupply = web3.utils.toBN(10000);
  const tokenDesc = "Skycraper in Dubai";
  const assetType = "Real Estate";
  const assetId = "ED197HIHO99";

  const divisible = true;
  const holdersLimit = true;
  const maxHolders = 100;
  //  const restrictedHolders = true;
  const tokenizerVerificationList = true;
  const ownerVerificationList = false;

  const tokenURI = "QmPXME1oRtoT627YKaDPDQ3PwA8tdP9rWuAAweLzqSwAWT";

  const firstName = "Sheikh";
  const lastName = "Khalifa";
  const company = "Emirates";
  const phone = "1-234-567-8900";
  const email = "khalifa@emirates.com";
  const website = "www.emirates.com";

  // Initiate Instance
  beforeEach(async function () {
    //The unique verification List
    verificationList = await VerificatioList.new();
    //The upgradeable tokenizer
    let tempSelfTokenizer = await SelfTokenizer.new();
    this.selfTokenizerRegistry = await SelfTokenizerRegistry.new();

    await this.selfTokenizerRegistry.addVersion(1, tempSelfTokenizer.address);
    await this.selfTokenizerRegistry.createProxy(1, accounts[0]);
    let proxyAddress = await this.selfTokenizerRegistry.proxyAddress();
    instance = await SelfTokenizer.at(proxyAddress);

    //Or we can take it as an arg in contructor
    await instance.updateVerificationListAddress(verificationList.address);
    await verificationList.addAuthorized(instance.address);

    console.log(await instance.verificationListAddress());
  });

  // Positive Token Creation Test
  it("Checking token creation", async function () {
    const submission = await instance.tokenizeAsset(
      tokenName,
      tokenSymbol,
      tokenSupply,
      client,
      tokenDesc,
      assetType,
      assetId,
      holdersLimit,
      maxHolders,
      //    restrictedHolders,
      tokenizerVerificationList,
      ownerVerificationList,
      tokenURI,
      { from: admin, gas: 4700000 }
    );

    assert.equal(
      submission.receipt.status,
      true,
      "Token creation unsuccessful! Check Token creation method"
    );
  });

  // Positive Token Address Retrieval Test
  it("Checking token details", async function () {
    await instance.tokenizeAsset(
      tokenName,
      tokenSymbol,
      tokenSupply,
      client,
      tokenDesc,
      assetType,
      assetId,
      holdersLimit,
      maxHolders,
      //restrictedHolders,
      tokenizerVerificationList,
      ownerVerificationList,
      tokenURI,
      { from: admin, gas: 4700000 }
    );
    const response = await instance.getTokenAddresses(client);

    //Owner of token should be the client
    //We can add more test on "tokenERC20"
    tokenERC20 = await Tokenize.at(response[0]);
    assert.equal(
      await tokenERC20.owner(),
      client,
      "client should be the owner of the token"
    );
    assert.equal(
      web3.utils.isAddress(response[0]),
      true,
      "Token not created correctly!"
    );
    if (tokenizerVerificationList)
      assert.equal(
        await verificationList.isWhiteListed(client),
        true,
        "client should have been whitlisted"
      );
  });

  it("Checking owner tokens", async function () {
    for (i = 0; i < 3; i++) {
      await instance.tokenizeAsset(
        tokenName,
        tokenSymbol,
        tokenSupply,
        client,
        tokenDesc,
        assetType,
        assetId,
        holdersLimit,
        maxHolders,
        //  restrictedHolders,
        tokenizerVerificationList,
        ownerVerificationList,
        tokenURI,
        { from: admin, gas: 4700000 }
      );
    }
    const response = await instance.getTokenAddresses(client);
    assert.equal(
      response.length,
      3,
      "Owned addresses incorrect, check tokenization method!"
    );
  });

  it("Checking IPFS hash update...", async function() {
    await instance.tokenizeAsset(
      tokenName,
      tokenSymbol,
      tokenSupply,
      client,
      tokenDesc,
      assetType,
      assetId,
      holdersLimit,
      maxHolders,
      //  restrictedHolders,
      tokenizerVerificationList,
      ownerVerificationList,
      tokenURI,
      { from: admin, gas: 4700000 }
    );
    // Return created token contract address
    const createdTokens = await instance.getTokenAddresses(client);
    // New IPFS URI
    const updatedIpfsHash = "UmPxDeAoTtETD27HaApS33wH8tdP9rWuA3131fwq2";
    // Update token struct of created token with new URI
    const ipfsUpdate = await instance.updateIPFS(createdTokens[0], updatedIpfsHash);
    // Return updated token struct
    const updatedTokenDetails = await instance.getTokenDetails(createdTokens[0]);
    // Check update
    assert.equal(
      updatedIpfsHash,
      updatedTokenDetails[6],
      'URI not updated!'
    );
  });

});
