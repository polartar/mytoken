// Import artifacts
const MyToken = artifacts.require("MyToken");
const MyTokenRegistry = artifacts.require("MyTokenRegistry");
const NewMyToken = artifacts.require("UpdatedMyToken");
const VerificatioList = artifacts.require("VerificationList");

contract("upgreadable scheme", function (accounts) {
  // Assign Accounts and Variables
  const client = accounts[2];
  const admin = accounts[0];
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  beforeEach(async function () {
    //the first version
    //The unique verification List
    verificationList = await VerificatioList.new();
    //The upgradeable tokenizer
    let tempMyToken = await MyToken.new();
    this.selfTokenizerRegistry = await MyTokenRegistry.new();

    await this.selfTokenizerRegistry.addVersion(1, tempMyToken.address);
    await this.selfTokenizerRegistry.createProxy(1, accounts[0]);
    let proxyAddress = await this.selfTokenizerRegistry.proxyAddress();
    this.oldTokenzer = await MyToken.at(proxyAddress);

    //Or we can take it as an arg in contructor
    await this.oldTokenzer.updateVerificationListAddress(
      verificationList.address
    );
    await verificationList.addAuthorized(this.oldTokenzer.address);

    //let's update some state variable and check in the test if they remain the same

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

    await this.oldTokenzer.tokenizeAsset(
      tokenName,
      tokenSymbol,
      tokenSupply,
      client,
      tokenDesc,
      assetType,
      assetId,
      holdersLimit,
      maxHolders,
      tokenizerVerificationList,
      ownerVerificationList,
      tokenURI,
      { from: admin, gas: 4700000 }
    );

    //the second version
    let tempNewMyToken = await NewMyToken.new();

    await this.selfTokenizerRegistry.addVersion(
      2,
      tempNewMyToken.address
    );
    await this.selfTokenizerRegistry.upgradeTo(2);
    proxyAddress = await this.selfTokenizerRegistry.proxyAddress();
    this.newTokenizer = await NewMyToken.at(proxyAddress);
  });
  it("should retain its old storage", async function () {
    let response = await this.newTokenizer.getTokenAddress(client, 0);
    assert.notEqual(response, ZERO_ADDRESS, "Did not retain its old storage");
  });
  it("should upgrade correctly", async function () {
    await this.newTokenizer.aNewFunction();

    assert.equal(
      (await this.newTokenizer.newVariable()).toString(),
      "100",
      "new method not added correclty"
    );
  });
});
