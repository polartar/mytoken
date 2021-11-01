var SelfTokenizer = artifacts.require("./SelfTokenizer.sol");
var VerificationList = artifacts.require("./VerificationList.sol");
var SelfTokenizerRegistry = artifacts.require("./SelfTokenizerRegistry.sol");

module.exports = async function (deployer, networks, accounts) {
  await deployer.deploy(VerificationList);
  await deployer.deploy(SelfTokenizer);
  await deployer.deploy(SelfTokenizerRegistry);

  const verificationList = await VerificationList.deployed();

  let tempSelfTokenizer = await SelfTokenizer.deployed();
  console.log('Deployed SelfTokenizer Address...', tempSelfTokenizer.address);
  this.selfTokenizerRegistry = await SelfTokenizerRegistry.deployed();
  let owner = await this.selfTokenizerRegistry.owner();
  console.log('Registry Owner...', owner, typeof(owner));
  console.log('Accounts 0...', accounts[0], typeof(accounts[0]));
  await this.selfTokenizerRegistry.addVersion(1, tempSelfTokenizer.address);
  const version = await this.selfTokenizerRegistry.getVersion(1);
  console.log('Registry Version...', version);

  // try {
  //   await this.selfTokenizerRegistry.createProxy(1, owner).then(function() {
  //     console.log('Proxy Set!!');
  //   })
  // } catch (error) {
  //   console.log('Proxy Error...', error);
  // }
  //
  // let proxyAddress = await this.selfTokenizerRegistry.proxyAddress();
  // console.log('Proxy Address...', proxyAddress);
  // const instance = await SelfTokenizer.at(proxyAddress);
  //
  // //Or we can take it as an arg in contructor
  // await instance.updateVerificationListAddress(verificationList.address);
  // //await instance.transferOwnership(accounts[0]);
  // await verificationList.addAuthorized(instance.address);
  //
  // console.log(
  //   "Verification List Address: ",
  //   await instance.verificationListAddress()
  // );
};
