pragma solidity >=0.4.22 < 0.8.0;

contract UserAddress {
    string public userAddress1 = "배송 출발";
    string public userAddress2 = "배송 중";
    string public userAddress3 = "배송 완료";
    //uint public cnt = 0;

    function getDeliveryInfo() public view returns (string memory) {
        // require(cnt == 0);
        return getUserAddress1();
        // require(cnt == 1);
        // return getUserAddress2();
        // require(cnt == 2);
        // return getUserAddress3();

    }

    function setUserAddress (string memory setAddress1) public {
        userAddress1 = setAddress1;
    }

    function getUserAddress1() public view returns (string memory) {
        return userAddress1;
    }

    function getUserAddress2() public view returns (string memory) {        
        return userAddress2;
    }

    function getUserAddress3() public view returns (string memory) {
        return userAddress3;
    }
}