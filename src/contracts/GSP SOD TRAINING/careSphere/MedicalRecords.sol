// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/*
SYSTEM FEATURES :
1. PATIRNT CAN VIEW THEIR DETAILS
2. dOCTOR CAN ADD ADD OR UPDATE PATIENT DETAILS
3. RECORDS ARE LINKED TO PATIENT ADDRESS
4. ACCESS CONTROL : ONLY DOCTOR CAN WRITE , ONLY PATIENT CAN VIEW 
5. doctor get acces from owner

*/

contract MedicalRecords{
     address public owner;

     constructor(){
        owner = msg.sender;
     }

     // doctor approval
     mapping (address => bool) public approvedDoctors;

     // "0xrweruhweiruew": true;

     // structure for medical Record 
     struct Record{
        string name;
        string bloodType;
        string diagnosis;
        string treatment;
        address doctor;
        uint256 timestamp;
     }

        // Mapping patient address => their medical record
     mapping (address => Record) private records;

     // // approve a doctor (only  by contract owner)

     function approveDoctor(address _doctor) public {
        require(msg.sender == owner,
         "Only owner can approve doctors");

        approvedDoctors[_doctor] = true;
     }



     //  add or update a record (only approved doctor)
     function addOrUpdateRecord(
        address patient,
        string memory name,
        string memory bloodType,
        string memory diagonis,
        string memory treatment
     ) public{ 

        require(approvedDoctors[msg.sender] == true, 
        " only approved doctor can add or update record");

        records[patient] = Record({
            name: name,
            bloodType: bloodType,
            diagnosis: diagonis,
            treatment: treatment,
            doctor: msg.sender,
            timestamp: block.timestamp
        });

        // view your own record (only patient)
       
        }
         function getMyInfo() public view returns (
        string memory name,
        string memory bloodType,
        string memory diagnosis,
        string memory treatment,
        address doctor,
        uint256 timestamp
        ){
            Record memory r = records[msg.sender];
            return (
                r.name, 
                r.bloodType,  
                r.diagnosis,     
                r.treatment,   
                r.doctor,      
                 r.timestamp

            );
        }

        function getPatienInfo( address _patient) public view returns (
        string memory name,
        string memory bloodType,
        string memory diagnosis,
        string memory treatment,
        address doctor,
        uint256 timestamp
        ){
            Record memory r = records[_patient];
            require(msg.sender == _patient || 
            msg.sender == r.doctor,
            " NOT AUHTORIZED TO VIEW THIS RECORD"
            );
            return (
                r.name, 
                r.bloodType,  
                r.diagnosis,     
                r.treatment,   
                r.doctor,      
                 r.timestamp

            );
        }
        
     }



