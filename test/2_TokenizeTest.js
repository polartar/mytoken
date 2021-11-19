const tokenize = artifacts.require("./Tokenize.sol");
const VerificationList = artifacts.require("VerificationList");

contract("tokenize", function (accounts) {
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

  var basisPointsRate = 2;

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

  it("Checking owner tokens", async function () {
    const response = await instance.balanceOf(client);
    console.log("Owner token balance: ", response);
    assert.equal(
      response,
      tokenSupply,
      "Supply Not Correct! Token not transferred to client"
    );
  });
  //These are test when token has chose to use the tokenizerVerification list

  it("Checking Transfer with Both VerificationList", async function () {
    const status = await verificationList.isWhiteListed(user2);

    const status_T = await instance.getownerWhiteListStatus(user2);

    console.log(
      "User whitelist (MyToken List) status pre addition: ",
      status
    );

    console.log("User whitelist (Owner List) status pre addition: ", status_T);
    // Add user & client to whitelist
    await verificationList.addWhiteList(user2, { from: admin, gas: 4700000 });
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
    const response = await instance.transfer(user2, transferAmount, {
      from: client,
      gas: 4700000,
    });
    //console.log(response);
    const bal = await instance.balanceOf(user2);
    // console.log(bal);
    transferAfterFees = transferAmount - fee;
    assert.equal(bal, transferAfterFees, "Transfer Failed");

    assert.equal(
      await instance.balanceOf(contractOwner),
      fee,
      "contract owner did not get the fees"
    );

    const x = await instance.owner();
    console.log(client);
    console.log("Owner Address: ", x);
  });

  it("Checking Authorization - Negative Test", async function () {
    const authorization = await verificationList.isWhiteListed(user2, {
      from: admin,
      gas: 4700000,
    });
    console.log(
      "Authorization status for client without addition: ",
      authorization
    );
    assert.equal(
      authorization,
      false,
      "Authorization test failed! Check authorization contract."
    );
  });

  it("Checking Authorization - Positive Test", async function () {
    await verificationList.isWhiteListed(user2);
    await verificationList.addWhiteList(user2, {
      from: admin,
      gas: 470000,
    });
    const authorization = await verificationList.isWhiteListed(user2);
    console.log(
      "Authorization status for client after addition: ",
      authorization
    );
    assert.equal(
      authorization,
      true,
      "Authorization test failed! Check authorization contract."
    );
  });

  it("Checking Transfer with OwnerList Only", async function () {
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

    console.log("User whitelist (Owner List) status pre addition: ", status_T);
    // Add user & client to whitelist
    await instance1.owneraddWhiteList(user3, { from: client, gas: 4700000 });
    // Checking status after addition
    const status_T2 = await instance1.getownerWhiteListStatus(user3);

    console.log("User whitelist (Owner List) status pre addition: ", status_T2);

    const transferAmount = 1000;
    const fee = (transferAmount * basisPointsRate) / 100; // 2% .. fee
    const response = await instance1.transfer(user3, transferAmount, {
      from: client,
      gas: 4700000,
    });
    //console.log(response);
    const bal = await instance1.balanceOf(user3);
    // console.log(bal);
    transferAfterFees = transferAmount - fee;
    assert.equal(bal, transferAfterFees, "Transfer Failed");

    assert.equal(
      await instance1.balanceOf(contractOwner),
      fee,
      "contract owner did not get the fees"
    );

    const x = await instance1.owner();
    console.log(client);
    console.log("Owner Address: ", x);
  });

  it("Checking Transfer with MyToken List Only", async function () {
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
      "User whitelist (MyToken List) status pre addition: ",
      status
    );

    // Add user & client to whitelist
    await verificationList.addWhiteList(user4, { from: admin, gas: 4700000 });
    await verificationList.addWhiteList(client, { from: admin, gas: 4700000 });

    // Checking status after addition
    const status2 = await verificationList.getWhiteListStatus(user4);

    console.log(
      "User whitelist (MyToken List) status post addition: ",
      status2
    );

    const transferAmount = 1000;
    const fee = (transferAmount * basisPointsRate) / 100; // 2% .. fee
    const response = await instance2.transfer(user4, transferAmount, {
      from: client,
      gas: 4700000,
    });
    //console.log(response);
    const bal = await instance2.balanceOf(user4);
    // console.log(bal);
    transferAfterFees = transferAmount - fee;
    assert.equal(bal, transferAfterFees, "Transfer Failed");

    assert.equal(
      await instance2.balanceOf(contractOwner),
      fee,
      "contract owner did not get the fees"
    );

    const x = await instance1.owner();
    console.log(client);
    console.log("Owner Address: ", x);
  });

  it("Checking Transfer with No List", async function () {
    instance8 = await tokenize.new(
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

    const transferAmount = 1000;
    const fee = (transferAmount * basisPointsRate) / 100; // 2% .. fee
    const response = await instance8.transfer(user7, transferAmount, {
      from: client,
      gas: 4700000,
    });
    //console.log(response);
    const bal = await instance8.balanceOf(user7);
    // console.log(bal);
    transferAfterFees = transferAmount - fee;
    assert.equal(bal, transferAfterFees, "Transfer Failed");

    assert.equal(
      await instance8.balanceOf(contractOwner),
      fee,
      "contract owner did not get the fees"
    );
  });

  it("Checking TransferFrom with Approval", async function () {
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

    const transferAmount = 1000;

    instance6.approve(user6, 1000, {
      from: client,
      gas: 4700000,
    });

    const fee = (transferAmount * basisPointsRate) / 100; // 2% .. fee
    const response = await instance6.transferFrom(
      client,
      user7,
      transferAmount,
      {
        from: user6,
        gas: 4700000,
      }
    );
    //console.log(response);
    const bal = await instance6.balanceOf(user7);
    // console.log(bal);
    transferAfterFees = transferAmount - fee;
    assert.equal(bal, transferAfterFees, "Transfer Failed");

    assert.equal(
      await instance6.balanceOf(contractOwner),
      fee,
      "contract owner did not get the fees"
    );

    const x = await instance6.owner();
    console.log(client);
    console.log("Owner Address: ", x);
  });

  it("Issue New tokens", async function(){
    const add = 100
    await instance.issue(add, { from: client });
    const aft = await instance.balanceOf(client);
    //console.log(aft);

    assert.equal(
      aft, 10100, "Tokens not issued"
    );

  }); 

  it("Update fee percentage", async function(){
    instance7 = await tokenize.new(
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
    basisPointsRate = 40
    await instance7.setParams(basisPointsRate, { from: contractOwner });
    
    //console.log(aft);

    const transferAmount = 1000;
    const fee = (transferAmount * basisPointsRate) / 1000; // 2% .. fee
    const response = await instance7.transfer(user4, transferAmount, {
      from: client,
      gas: 4700000,
    });
    //console.log(response);
    const bal = await instance7.balanceOf(user4);
    // console.log(bal);
    transferAfterFees = transferAmount - fee;
    assert.equal(bal, transferAfterFees, "Transfer Failed");

    assert.equal(
      await instance7.balanceOf(contractOwner),
      fee,
      "contract owner did not get the fees"
    );

  }); 

  /*it('Check Verification List', async function() {

    const response = await instance.balanceOf(client);
    console.log(response);
    assert.equal(response, 10000, 'Supply Not Correct! Token not transferred to client');

  });*/
});
