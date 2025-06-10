//Import readline for interaction
const readline = require("readline")

//create a readline interface for the CLI
const rl = readline.createInterface({
    input: process.stdin,     //standard input is keyboard
    output: process.stdout    //standard output is keyboard
})

//define character sets as strings
const LOWER = "abcdefghijklmnopqrstuvwxyz"; //lowercase letters
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; //uppercase letters
const NUMBERS = "0123456789";               //digits 0-9
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>?";//common symbols

//function to prompt user for password options and generate password
function promptStart(){
    rl.question("Enter password length, minimum of 4 (e.g. 10): ", lenInput => {
        const length = parseInt(lenInput)
        //validate length (greater than or equal to 4)
        if(isNaN(length) || length < 4){
            console.log("Please enter a number greater than or equal to 4")
            return promptStart()   //reset function
        }
        //continue to next prompt if valid
        promptYN("Include uppercase letters? (y/n) ", includeUpper => {
            promptYN("Include numbers? (y/n) ", includeNumbers => {
                promptYN("Include symbols? (y/n) ", includeSymbols => {
                    //3 variables for upper, numbers and symbols are returned as either true or false based on the users promptYN function input
                    generatePassword(length, includeUpper, includeNumbers, includeSymbols)
                })
            })
        })
    })
}

function promptYN(question, callback){ 
    rl.question(question, answer => { 
        const ans = answer.trim().toLowerCase()
        if(ans === "y" || ans === "yes"){
            callback(true)//runs the function provided with the value as true (includeUpper, includeNumbers or includeSymbols)
        } else if (ans === "n" || ans === "no"){
            callback(false)//runs the function provided with the value as true (includeUpper, includeNumbers or includeSymbols)
        }else{
            console.log("Please type either y or n")
            promptYN(question,callback) //reruns the function if there is an invalid input
        }
    })
}

function generatePassword(length, upper, num, sym){
    let chars = LOWER
    if(upper) chars += UPPER
    if(num) chars += NUMBERS
    if(sym) chars += SYMBOLS

    let password = ""
    for(let i = 0; i < length; i++){
        //randomly select a character from the "chars" string
        const idx = Math.floor(Math.random() * chars.length)
        password += chars[idx]
    }

    //output generated password to user
    console.log("\nYour generated password: "+password)
    rl.close()
}

//start the app by printing a title and prompting the user
console.log("Hello, today we are going to generate a password")
console.log("You will be asked a series of questions, please read them carefully and reply as you are prompted")
promptStart()