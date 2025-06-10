//import readline for CLI
const readline = require("readline");
//import filesystem module for file operations
const fs = require("fs");

//define the file name for storing patient data in JSON format
const FILE = "patient-data.json";

//initialize the patient data array and load data from the file if it exists
let patientData = [];
if (fs.existsSync(FILE)) { // Check if the file exists
    try {
    //read and parse the file's contents and add them to the array
        patientData = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    }catch{
        patientData = []; //if there is an error reading the file, start with an empty array
    }
}

//create the interface for inputs and outputs
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//save patient data to the json file
function saveData() {
    fs.writeFileSync(FILE, JSON.stringify(patientData, null, 2));
}



let isPatient;
function initialiseProgram(){
    rl.question("Please type 1 if you are a healthcare provider (or similar) or type 2 if you are a patient ", isPatientAnswer => {
        //console.log(isPatientAnswer)
        if(isPatientAnswer == 1){
            isPatient = false
        }else if(isPatientAnswer == 2){
            isPatient = true
        }else{          
            console.log("Invalid input, please enter either 1 or 2")
            return initialiseProgram()
        }

        printPatientList()
        
        //printFullPatientData()   
    })


}




//function to display a list of patient names and NHI numbers
function printPatientList(){
    if (patientData.length === 0) { // If there is no patient information
        console.log("\nNo patients currently exist");
    }else{
        //print table headers
        console.log("\n  Full name         |  NHI number");
        console.log("--------------------|------------------");
        //print full name and NHI number in a formatted table
        patientData.forEach((data, idx) => {
            //fullname = data.firstname + " " + data.lastname
            //console.log(fullname)
            let row =
                ("  "+data.firstname + " " + data.lastname).padEnd(20) + '|  ' +                 
                data.NHI.padEnd(12)    
            console.log(row);
        });
    }

    rl.question("\nPlease type the full name or NHI number of the patient you would like to view the data of (or create a patient profile for) ", patientID =>{
        let patientFound = false
        let fullName;
        patientData.forEach((data, idx) => {
            fullName = (data.firstname + " " + data.lastname).trim().toLowerCase()
            if(patientID.trim().toLowerCase() == fullName){
                patientFound = idx
                printFullPatientData(patientFound)
            }else if(patientID.trim().toLowerCase() == data.NHI.trim().toLowerCase()){
                patientFound = idx
                printFullPatientData(patientFound)
            }
        });
        //if someehifnkasdfas

    })

    
    
    
}

//function to display all patient information in a table format
function printFullPatientData(idx) {
    //console.log(isPatient)
    
    //print table headers
    console.log("\n  First Name  |  Last Name     |  Birth Date  |  Gender        |  NHI Number  |  Phone number ");
    console.log("--------------|----------------|--------------|----------------|--------------|---------------");
    //print the data for the chosen patient
    let row =       
        ("  "+patientData[idx].firstname).padEnd(14) + '|  ' +              
        patientData[idx].lastname.padEnd(13) + ' |  ' +              
        patientData[idx].birthdate.padEnd(12) + '|  ' +   
        patientData[idx].gender.padEnd(14) + '|  ' +           
        patientData[idx].NHI.padEnd(12) + '|  ' +
        patientData[idx].phonenumber;             
    console.log(row);


    
    rl.close()
}

initialiseProgram()
