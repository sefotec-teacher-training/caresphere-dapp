// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Hello {
    string public message;

    constructor( string memory initialMessage){
        message = initialMessage;
    }

    function updateMessage(string memory newMessage) public{
        message = newMessage; 
    }
}

// this is comment 


/*

this is comment 

*/

// types

// int8 / uint 
// fixed /unfixed
// bool
//  address 0x
// string
// enums


// ** Variables 
// state variables : permanently stored in contract storage
// lcal variables : values are present till function is exectuting
// glabal variables: glabal namespace used to get information about blockchain


 contract FakeTest{
     uint    storedData ; 

constructor () {
    storedData = 10; // state variable 
}


function getstate() public   view  returns (uint){
    uint a = 100; // local varibale 
    uint result = a + storedData;
    return  result;
}
     
     function getGlobalInfo() public view returns (
        address sender,
        uint timestamp,
        uint blockNum,
        address contractAddress
    ) {
        // Using global variables
        sender = msg.sender;
        timestamp = block.timestamp;
        blockNum = block.number;
        contractAddress = address(this);
    }
     

 }

 // scope

 contract Scope{
    uint public data = 100; 
    uint private pdata = 200;
    uint internal  idata = 300;

    function getpData() public view  returns (uint){
        return pdata;
    }
 }

 contract Child is Scope{

function getMyData() public view returns (uint){
    return idata;
}
 }


contract side {
    Scope myscope; 
function getMyData() public view  returns (uint) {
    return myscope.data();
}


}


// conditions : 

// if(){
//      ...
// } else{
//     ...
// }

// loop ;  while loop, for loop, do .. while loop 

