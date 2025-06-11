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

//handles yes or no questions, returning true or false
function promptYN(question, callback){ 
    rl.question(question, answer => { 
        const ans = answer.trim().toLowerCase()
        if(ans === "y" || ans === "yes"){
            callback(true)//runs the function provided with the value as true 
        } else if (ans === "n" || ans === "no"){
            callback(false)//runs the function provided with the value as false 
        }else{
            console.log("Please type either y or n")
            promptYN(question,callback) //reruns the function if there is an invalid input
        }
    })
}

let isPatient;//initialise global isPatient variable

//asks if user is a patient or not then prints patient list
function initialiseProgram(){
    rl.question("Please type 1 if you are a healthcare provider (or similar) or type 2 if you are a patient ", isPatientAnswer => {
        //console.log(isPatientAnswer)
        if(isPatientAnswer == 1){
            isPatient = false//The user is not a patient
        }else if(isPatientAnswer == 2){
            isPatient = true//The user is a patient
        }else{          
            console.log("Invalid input, please enter either 1 or 2")//handles inputs that aren't 1 or 2
            return initialiseProgram()
        }

        printPatientList()//prints the list of current patients
        
        //printFullPatientData()   
    })


}




//function to display a list of patient names and NHI numbers
function printPatientList(){
    if (patientData.length === 0) { // If there is no patient information
        console.log("\nNo patients currently exist");
    }else{
        //print table headers
        console.log("\n  List of existing patients:")
        console.log("\n  Full name         |  NHI number");
        console.log("--------------------|------------------");
        //print full names and NHI numbers of each patient in a formatted table
        patientData.forEach((data, idx) => {
            //fullname = data.firstname + " " + data.lastname
            //console.log(fullname)
            let row =
                ("  "+data.firstName + " " + data.lastName).padEnd(20) + '|  ' +                 
                data.NHI.padEnd(12)    
            console.log(row);
        });
    }

    askForPatient()//prompt which patient the user wants to select
}

//ask the user which patient they want to view the data for, or if the patient doesn't exist, prompt them on whether they want to create a new one
function askForPatient(){
    rl.question("\nPlease type the full name or NHI number of the patient you would like to view the data of (or create a patient profile for) ", patientID =>{
        let patientFound = null
        let fullName;
        patientData.forEach((data, idx) => {//loop through each patient's information to find a matching name or NHI number
            fullName = (data.firstName + " " + data.lastName).trim().toLowerCase()
            if(patientID.trim().toLowerCase() == fullName){
                patientFound = idx
                printFullPatientData(patientFound)
            }else if(patientID.trim().toLowerCase() == data.NHI.trim().toLowerCase()){
                patientFound = idx
                printFullPatientData(patientFound)
            }
        })

        if(patientFound == null){//if the input doesnt match a patient name or NHI number
            promptYN("\nPatient does not exist, would you like to create a new patient? (y/n)",createNew => {
                if(createNew){
                    createNewPatient()//if yes, run function to create a new patient
                }else{
                    askForPatient()//if no, rerun this function
                }
                
            })
        }

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
        ("  "+patientData[idx].firstName).padEnd(14) + '|  ' +              
        patientData[idx].lastName.padEnd(13) + ' |  ' +              
        patientData[idx].birthDate.padEnd(12) + '|  ' +   
        patientData[idx].gender.padEnd(14) + '|  ' +           
        patientData[idx].NHI.padEnd(12) + '|  ' +
        patientData[idx].phoneNumber;             
    console.log(row);

    promptYN("\nWould you like to edit this patient's data? (y/n)",editPatient => {//prompt y/n if they want to edit selected patient data
        if(editPatient){
            editChosenPatient(idx)//if yes, run edit function
        }else{//if no, prompt y/n whether they want to leave the program or return to patient list
            promptYN("Would you like to exit the program (y/n) (y = exit, n = go back to list of patient names) ", exitProgram =>{
                if(exitProgram){//if yes, end program
                    console.log("Exiting program, goodbye")
                    rl.close()
                }else{//if no, run the patient list function again
                    printPatientList()
                }
            })
        }
    })
        
}

//function to add a new patient and their details to the json file
function createNewPatient() {
    rl.question("\nEnter the patient's first name ", firstNameInput => { //ask for the first name
        let firstName = firstNameInput.trim();//remove empty space from ends and convert to lower case
        if (firstName === ""){ console.log("Invalid input"); return createNewPatient() } //check if empty
        firstName = firstName.slice(0,1).toUpperCase() + firstName.slice(1).toLowerCase() //capitalises first letter and makes the rest lowercase
        //console.log(firstName)
        rl.question("Enter the patient's last name ", lastNameInput => {//ask for the last name
            let lastName = lastNameInput.trim();      
            if (lastName === ""){ console.log("Invalid input"); return createNewPatient() }
            lastName = lastName.slice(0,1).toUpperCase() + lastName.slice(1).toLowerCase()
            rl.question("Enter the patient's birth date in the format DD/MM/YYYY ", birthDateInput => {//ask for the birth date
                let birthDate = birthDateInput.trim();      
                if (birthDate.length != 10){ console.log("Invalid input"); return createNewPatient() }//check if the birth date is the correct length
                rl.question("Enter the patient's gender ", genderInput => { //ask for the gender
                    let gender = genderInput.toLowerCase().trim();      
                    if (gender === ""){ console.log("Invalid input"); return createNewPatient() }
                    rl.question("Enter the patient's NHI number ", NHIInput => { //ask for the NHI number
                        let NHI = NHIInput.toUpperCase().trim();      
                        if (NHI.length != 7){ console.log("Invalid input"); return createNewPatient() }//check if the NHI number is the correct length
                        rl.question("Enter the patient's phone number ", phoneNumberInput => { //ask for the phone number
                            let phoneNumber = phoneNumberInput.trim();      
                            if (phoneNumber === ""){ console.log("Invalid input"); return createNewPatient() }
                        
                            patientData.push({//creates a new object in the patientData array with all the patient data
                                firstName,
                                lastName,
                                birthDate,
                                gender,
                                NHI,
                                phoneNumber
                            });
                            //console.log(patientData)

                            saveData(); //save updated patient info to the JSON file
                            console.log(firstName, lastName, "has been added to the patient list!");
                            printFullPatientData(patientData.length-1) //prints the data of the new patient

                        });
                    });
                });
            });
        });
    });
}

//function for editing parts of a selected patients data
function editChosenPatient(idx){
    console.log("\nPlease input the number for the field you would like to edit");
    console.log("1. First name (patients cannot edit)");
    console.log("2. Last name (patients cannot edit)");
    console.log("3. Date of birth");
    console.log("4. Gender");
    console.log("5. NHI number (patients cannot edit)")
    console.log("6. Phone number")
    console.log("7. Go back without editing");
    rl.question("\nChoose an option (1-7): ", handleChoice =>{//user chooses from options presented to them
        switch(handleChoice.trim()) {
            case "1": //if user typed 1
                if(!isPatient){//user can only edit this part if they are not a patient
                    rl.question("Enter new first name ", input => {//asks for new first name
                        if(input.trim() === ""){console.log("Invalid input");return editChosenPatient(idx)};//if input is empty rerun this function
                        patientData[idx].firstName = input.slice(0,1).toUpperCase() + input.slice(1).toLowerCase();//update the first name in the data, capitalise first letter
                        saveData();//save the data to the json file
                        console.log("\nFirst name updated successfully");
                        return printFullPatientData(idx);//print the updated patient data
                    });
                }else{console.log("Invalid input"); return editChosenPatient(idx)};//if they are a patient, rerun this function
                break;//ensures the code doesnt fall through to other cases

            //most below code inside this function could've used helper functions as it is similar to the above code with small changes
            //will not comment most of it due to its similarity
            case "2": 
                if(!isPatient){
                    rl.question("Enter new last name ", input => {//asks for new last name
                        if(input.trim() === ""){console.log("Invalid input");return editChosenPatient(idx)};
                        patientData[idx].lastName = input.slice(0,1).toUpperCase() + input.slice(1).toLowerCase();
                        saveData();
                        console.log("\nLast name updated successfully");
                        return printFullPatientData(idx);
                    });
                }else{console.log("Invalid input"); return editChosenPatient(idx)};
                break;

            case "3": 
                rl.question("Enter new date of birth in the format DD/MM/YYYY ", input => {//asks for new date of birth
                    if((input.trim()).length != 10){console.log("Invalid input");return editChosenPatient(idx)};
                    patientData[idx].birthDate = input.trim();
                    saveData();
                    console.log("\nDate of birth updated successfully");
                    return printFullPatientData(idx);
                });
                break;

            case "4": 
                rl.question("Enter new patient gender ", input => {//asks for new patient gender
                    if(input === ""){console.log("Invalid input");return editChosenPatient(idx)};
                    patientData[idx].gender = input.trim();
                    saveData();
                    console.log("\nGender updated successfully");
                    return printFullPatientData(idx);
                });
                break;

            case "5": 
                if(!isPatient){
                    rl.question("Enter new NHI number ", input => {//asks for new NHI number
                        if((input.trim()).length != 7){console.log("Invalid input");return editChosenPatient(idx)};
                        patientData[idx].NHI = input.trim();
                        saveData();
                        console.log("\nNHI number updated successfully");
                        return printFullPatientData(idx);
                    });
                }else{console.log("Invalid input"); return editChosenPatient(idx)};
                break;

            case "6": 
                rl.question("Enter new patient phone number ", input => {//asks for new phone number
                    if(input === ""){console.log("Invalid input");return editChosenPatient(idx)};
                    patientData[idx].phoneNumber = input.trim();
                    saveData();
                    console.log("\nPhone number updated successfully");
                    return printFullPatientData(idx);
                });
                break;

            case "7": printFullPatientData(idx); break; //prints the patient data again without updating anything
            default: console.log("Invalid input"); editChosenPatient(idx); //any other input just runs the function again
        }
    })
}



initialiseProgram()  //runs the function to start the program   