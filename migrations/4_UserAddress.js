// 새로만든 UserAddress.sol 파일의 exports 시킴
// 계약 정보에 필요한 JSON 파일 생성
var UserAddress = artifacts.require("./UserAddress.sol");

module.exports = function(deployer) {
  deployer.deploy(UserAddress);
};
