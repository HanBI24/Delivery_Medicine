pragma solidity ^0.5.0;

contract Adoption {
    address[16] public adopters;
    mapping(address => uint) private balances;

    function adopt(uint mId) public payable returns(uint) { 
        require(mId >= 0 && mId <= 15 && balances[msg.sender] + msg.value >= balances[msg.sender]);
        // adopters[mId] = msg.sender;
        balances[msg.sender] += msg.value;
        return balances[msg.sender];
    }

    function getAdopters() public view returns(address[16] memory) {
        return adopters;
    }  
    
}