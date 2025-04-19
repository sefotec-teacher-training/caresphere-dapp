// SPDX-License-Identifier: MIT
pragma solidity ^ 0.8.17;


contract Arrys{

    uint[] public  numbers = [1,2,3];
}

contract EnumData{
    enum Size{SMALL, MEDIUM, LARGE}
    enum Gender{MALE, FIMALE}

    Size choice = Size.SMALL;
    Gender mygender = Gender.MALE; 

    struct Student{
        string name;
        uint age;
        uint id;
    }

    Student s1;
    function setStudent() public{
        s1 = Student("john doe", 10, 1);
    }

    function getName () public  view returns (string memory){
        return  s1.name;
    }
    function getFullInfo() public view  returns (
        string memory ,
        uint,
        uint
    ){
        return (s1.name, s1.age, s1.id);
    }

    // assert( 1 week == 7 days);
    // assert(1 ether == 200 finney);

}