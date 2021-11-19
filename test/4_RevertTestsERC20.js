const { expectRevert } = require('@openzeppelin/test-helpers');

const tokenize = artifacts.require("./Tokenize.sol");
const VerificationList = artifacts.require("VerificationList");


contract('tokenize', (accounts) => {

  // Assign Accounts and Variables
  const client = accounts[2];
  const user2 = accounts[1];
  const admin = accounts[0];
  const user3 = accounts[3];
  const user4 = accounts[4];
  const user6 = accounts[6];
  const user7 = accounts[7];

  const contractOwner = accounts[5];
  //  const admin = '0x49f08106444730880c2A6796f84aaDAc2Fa92cFf';
  //  const fee = web3.utils.toBN(250000000000000000);

  const tokenName = "Burj Khalifa";
  const tokenSymbol = "BKH";
  const tokenSupply = 10000;
  const decimal = 18;
  const tokenURI = "QmPXME1oRtoT627YKaDPDQ3PwA8tdP9rWuAAweLzqSwAWT";

  const tokenizerVerificationList = true;
  const ownerVerificationList = true;

  const basisPointsRate = 2;

  // Initiate Instance
  beforeEach(async function () {
    verificationList = await VerificationList.new();
    instance = await tokenize.new(
      tokenName,
      tokenSymbol,
      decimal,
      client,
      tokenSupply,
      tokenURI,
      tokenizerVerificationList,
      verificationList.address,
      ownerVerificationList,
      contractOwner
    );
  });

  it("Checking Transfer with Both VerificationList -- Negative Test", async function () {
    const status = await verificationList.isWhiteListed(user2);

    const status_T = await instance.getownerWhiteListStatus(user2);

    console.log(
      "User whitelist (MyToken List) status pre addition: ",
      status
    );

    console.log("User whitelist (Owner List) status pre addition: ", status_T);
    // Add user & client to whitelist
    await verificationList.addWhiteList(client, { from: admin, gas: 4700000 });
    await instance.owneraddWhiteList(user2, { from: client, gas: 4700000 });
    // Checking status after addition
    const status2 = await verificationList.getWhiteListStatus(user2);

    const status_T2 = await instance.getownerWhiteListStatus(user2);

    console.log(
      "User whitelist (MyToken List) status post addition: ",
      status2
    );

    console.log("User whitelist (Owner List) status pre addition: ", status_T2);


    const transferAmount = 1000;
    const fee = (transferAmount * basisPointsRate) / 100; // 2% .. fee

    await expectRevert(
        instance.transfer(user2, transferAmount, { from: client }),
        "revert"
      );
  });


  it("Checking Transfer with OwnerList Only -- Negative Test", async function () {
    instance1 = await tokenize.new(
      tokenName,
      tokenSymbol,
      decimal,
      client,
      tokenSupply,
      tokenURI,
      false,
      verificationList.address,
      ownerVerificationList,
      contractOwner
    );

    const status_T = await instance1.getownerWhiteListStatus(user3);

    console.log("User whitelist (Owner List) status : ", status_T);
    // Checking status after addition
    const status_T2 = await instance1.getownerWhiteListStatus(user3);

    const transferAmount = 1000;
    const fee = (transferAmount * basisPointsRate) / 100; // 2% .. fee

    await expectRevert(
        instance1.transfer(user3, transferAmount, { from: client }),
        "revert"
      );
  });

  it("Checking Transfer with MyToken List Only -- Negative Test", async function () {
    instance2 = await tokenize.new(
      tokenName,
      tokenSymbol,
      decimal,
      client,
      tokenSupply,
      tokenURI,
      true,
      verificationList.address,
      false,
      contractOwner
    );

    const status = await verificationList.isWhiteListed(user4);

    console.log(
      "User whitelist (MyToken List) status : ",
      status
    );


   
    const transferAmount = 1000;
    const fee = (transferAmount * basisPointsRate) / 100; // 2% .. fee

    await expectRevert(
        instance2.transfer(user4, transferAmount, { from: client }),
        "revert"
      );
  });

  it("Checking TransferFrom with Approval -- Negative Test", async function () {
    instance6 = await tokenize.new(
      tokenName,
      tokenSymbol,
      decimal,
      client,
      tokenSupply,
      tokenURI,
      false,
      verificationList.address,
      false,
      contractOwner
    );


    // APproved less than transferAmount
    instance6.approve(user6, 100, { 
      from: client,
      gas: 4700000,
    });

    
    const transferAmount = 1000;
    const fee = (transferAmount * basisPointsRate) / 100; // 2% .. fee

    await expectRevert(
        instance6.transferFrom(client, user3, transferAmount, { from: user6 }),
        "invalid opcode"
      );
  });

  describe('Adding From another user to owner White List -- Negative Test', function() {
    it('Fails when called by a non-owner account', async function () {
      await expectRevert(
        instance.owneraddWhiteList({ from: user4 }),
        "invalid address"
      );
    });
  });

  describe('Adding From another user to MyToken White List -- Negative Test', function() {
    it('Fails when called by a non-admin account', async function () {
      await expectRevert(
        verificationList.addWhiteList({ from: user4 }),
        "invalid address"
      );
    });
  });

  describe('Issue new tokens -- Negative Test', function() {
    it('Fails when called by a non-owner account', async function () {
      await expectRevert(
        instance.issue(100, { from: user4 }),
        "revert"
      );
    });
  });



  describe('Update fee percentage -- Negative Test', function() {
    it('Fails when called by a non-contractOwner account', async function () {
      await expectRevert(
        instance.setParams(40, { from: client }),
        "revert"
      );
    });
  });

});