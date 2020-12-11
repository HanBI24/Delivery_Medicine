var UserAddress = artifacts.require("./UserAddress.sol");

module.exports = function(deployer) {
  deployer.deploy(UserAddress);
};
