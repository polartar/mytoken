var SelfMyToken = artifacts.require("./SelfMyToken.sol");
var VerificationList = artifacts.require("./VerificationList.sol");
var MyTokenRegistry = artifacts.require("./MyTokenRegistry.sol");

module.exports = async function (deployer, networks, accounts) {
  await deployer.deploy(VerificationList);
  await deployer.deploy(SelfMyToken);
  await deployer.deploy(MyTokenRegistry);

  const verificationList = await VerificationList.deployed();

  let tempSelfMyToken = await SelfMyToken.deployed();
  console.log('Deployed SelfMyToken Address...', tempSelfMyToken.address);
  this.selfMyTokenRegistry = await MyTokenRegistry.deployed();
  let owner = await this.selfMyTokenRegistry.owner();
  console.log('Registry Owner...', owner, typeof(owner));
  console.log('Accounts 0...', accounts[0], typeof(accounts[0]));
  await this.selfMyTokenRegistry.addVersion(1, tempSelfMyToken.address);
  const version = await this.selfMyTokenRegistry.getVersion(1);
  console.log('Registry Version...', version);

  // try {
  //   await this.selfMyTokenRegistry.createProxy(1, owner).then(function() {
  //     console.log('Proxy Set!!');
  //   })
  // } catch (error) {
  //   console.log('Proxy Error...', error);
  // }
  //
  // let proxyAddress = await this.selfMyTokenRegistry.proxyAddress();
  // console.log('Proxy Address...', proxyAddress);
  // const instance = await SelfMyToken.at(proxyAddress);
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
