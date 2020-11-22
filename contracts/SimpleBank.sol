pragma solidity ^0.5.10;

contract Simplebank {

    mapping(address => uint) private balances;

// 어떤 금액이든 상관없음 () 공백 가능
//출금
    function deposit() public payable returns(uint){
        require(balances[msg.sender] + msg.value >= balances[msg.sender]);
        balances[msg.sender] += msg.value;
        return balances[msg.sender];
    }

//입금
    function withdraw(uint amount) public returns(uint remainingBalance){
        require(balances[msg.sender] >= amount);
        balances[msg.sender] -= amount;
        msg.sender.transfer(amount);
        remainingBalance = balances[msg.sender];
        // smae
        //return balances[msg.sender];
    }

//금액 확인
    function balance() view public returns(uint){
        return balances[msg.sender];
    }
}