# SDV503-assessment-3-zandi-galpin

User Manual:
How to run the program:
1. Open the repository on github and click the "code" dropdown.
2. Copy the https link
3. Open a recent version of Visual Studio Code and open the terimal using ctrl + `
4. Type "git clone " and then paste the link and press enter.
5. If npm is not installed type "npm install -g npm" and press enter.
6. If node.js is not installed then download it from online.
7.	Run the program using “node patient-profile.js”

Using the program:
1.	Please read and follow the instructions displayed in the terminal very carefully. If you are a patient, type 1 and press enter. If you are a healthcare professional or of another similar occupation, type 2 and press enter.
2.	You should see a list of existing patient names and NHI numbers. Type the full name or NHI number of the patient you wish to see more information about. From here, 2 things may happen.      
a.	The patient does not exist, you may be prompted to create a new patient. If you want to create a new patient, type y and press enter, if not, type n and press enter (you will be brought back to the start of step 2). If you pressed y, follow all the instructions very carefully, inputting the first name then pressing enter, inputting the last name then pressing enter, typing the date of birth ONLY in the format of DD/MM/YYYY, for example, 09/03/2000 for the 9th of March in the year 2000, then pressing enter, then typing the gender of the patient and pressing enter, then typing the NHI number of the patient and pressing enter, then typing the phone number of the patient and pressing enter. This should bring you to step 3.

b.	The patient exists, you will be brought to step 3.

3.	All data for the selected patient will be displayed and you will be asked if you would like to edit the patient’s data. Type y if you would like to edit it or n if you would not like to edit it.

a.	If you typed n, you will be asked if you would like to delete the patient and its data. Type either y and press enter for yes or type n and press enter for no.

i.	If you typed n, you will be asked if you would like to exit the program. Type y and press enter if you would like to end the program. Type n and press enter if you would like to go back to step 2.

ii.	If you typed y, the patient will be deleted and you will be brought back to step 2.

b.	If you typed y and pressed enter at the beginning of step 3, options will be displayed for what you can edit. Read the options carefully and notice that there is a number next to each of them. Type the number that corresponds to the option you would like to select, and press enter.

i.	If you selected 7, you will be brought back to the start of step 3. 

ii.	If you selected 3, 4, or 6, you will be asked to input the new field. Type in the new field and press enter. You will then be brought back to the start of step 3.

iii.	If you selected 1,2, or 5 and are a patient, you will be brought back to the start of step 3 as you cannot edit these as a patient. However, if you are not a patient and select one of these, you will be asked to input the new field. Type in the new field and press enter. You will then be brought back to the start of step 3.






Coding Checklist:

Commenting and Documentation:

At least one comment to describe what a functions does
 
Indentation:

use tabs for each part within a function or if statement or for loop and etc
 
Avoid obvious comments:

Don’t comment parts of the code which are easy to understand, focus on making hard to understand sections of code well commented
 
Code grouping:

Code grouped by program functionality
 
Consistent Nameing:

Use camel case
 
DRY:

Create functions for code used in multiple areas
 
Avoid deep nesting
 
 
Limit Line Length:

If the line cannot be fully viewed on the application, it is too long and needs refactoring
 
File and Folder Organisation:

Have a folder which contains the code
 
Consistent Temporary Names
 
Capitalise SQL Special Words
 
Separation of Code and Data

2 different files for data and code
 
Checklist source: Laurens Noordove, nmit student
