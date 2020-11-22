var adoption = artifacts.require("./adoption.sol");

module.exports = function(deployer) {
  deployer.deploy(adoption);
};
