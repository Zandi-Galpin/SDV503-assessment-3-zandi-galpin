// Import the readline module for handling command line input/output
const readline = require('readline');

// Import the fs (filesystem) module for reading/writing files
const fs = require('fs');

// Define the file where tasks will be saved
const FILE = 'tasks.json';

// Initialize an empty array to store tasks
let todos = [];

// Check if the tasks.json file exists
if (fs.existsSync(FILE)) {
  try {
    // If file exists, read its contents (synchronously)
    const data = fs.readFileSync(FILE, 'utf8');
    // Parse JSON string into the todos array
    todos = JSON.parse(data);
  } catch (e) {
    // If there is any error, start with an empty array
    todos = [];
  }
}

// Create a readline interface for command line interaction
const rl = readline.createInterface({
  input: process.stdin,   // Set standard input (keyboard) as input source
  output: process.stdout  // Set standard output (console) as output target
});

// Function to display the main menu options
function showMenu() {
  console.log('\n=== To-Do List App ===');          // Print app header
  console.log('1. Show Tasks');                      // Option 1: Show all tasks
  console.log('2. Add Task');                        // Option 2: Add a new task
  console.log('3. Mark Task as Done');               // Option 3: Mark a task as completed
  console.log('4. Delete Task');                     // Option 4: Delete a task
  console.log('5. Exit');                            // Option 5: Exit the app
  rl.question('\nChoose an option (1-5): ', handleMenu); // Prompt user for menu choice
}

// Function to save tasks array to the tasks.json file
function saveTasks() {
  fs.writeFileSync(FILE, JSON.stringify(todos, null, 2)); // Write the todos array as pretty JSON
}

// Function to handle the menu option entered by the user
function handleMenu(choice) {
  switch (choice.trim()) {                  // Use the trimmed input for comparison
    case '1':
      listTasks();                          // If '1', show all tasks
      break;
    case '2':
      addTask();                            // If '2', add a new task
      break;
    case '3':
      promptMarkTaskAsDone();               // If '3', mark a task as completed
      break;
    case '4':
      promptDeleteTask();                   // If '4', delete a task
      break;
    case '5':
      console.log('Goodbye!');              // If '5', print goodbye and close the app
      rl.close();                           // Close readline interface
      break;
    default:
      console.log('Invalid choice. Try again.'); // If not 1-5, show error message
      showMenu();                           // Show menu again
      break;
  }
}

// Function to display all tasks in the list
function listTasks() {
  console.log('\nYour To-Do List:');                 // Print list header
  if (todos.length === 0) {                          // If there are no tasks
    console.log('No tasks found.');                  // Inform user that list is empty
  } else {                                           // If there are tasks
    todos.forEach((task, idx) => {                   // For each task in the array
      const status = task.done ? 'Completed' : 'Not completed'; // Determine status text
      console.log(`${idx + 1}. (${status}) ${task.text}`);      // Print task number, status, and description
    });
  }
  showMenu();                                        // Show menu again after listing tasks
}

// Function to add a new task to the list
function addTask() {
  rl.question('\nEnter the task: ', (task) => {      // Prompt user to enter the task description
    if (task.trim() === '') {                        // If input is empty or only spaces
      console.log('Task cannot be empty.');          // Show error message
    } else {
      todos.push({ text: task, done: false });       // Add new task object (not completed by default)
      saveTasks();                                   // Save updated tasks to file
      console.log('Task added!');                    // Confirm addition
    }
    showMenu();                                      // Show menu again
  });
}

// Function to prompt the user to select a task to mark as completed
function promptMarkTaskAsDone() {
  if (todos.length === 0) {                          // If there are no tasks
    console.log('\nNo tasks to mark as done.');      // Inform user
    return showMenu();                               // Show menu and exit function
  }
  console.log('\nSelect the number of the task to mark as completed:'); // Print prompt header
  todos.forEach((task, idx) => {                     // List all tasks with their numbers
    const status = task.done ? 'Completed' : 'Not completed'; // Status as text
    console.log(`${idx + 1}. (${status}) ${task.text}`);      // Print each task
  });
  rl.question('\nTask number: ', (num) => {          // Prompt for task number
    markTaskAsDone(num);                             // Pass input to markTaskAsDone function
  });
}

// Function to mark the selected task as completed
function markTaskAsDone(num) {
  let idx = parseInt(num) - 1;                       // Convert user input to array index
  if (todos[idx]) {                                  // If a task exists at that index
    todos[idx].done = true;                          // Mark the task as completed
    saveTasks();                                     // Save changes to file
    console.log('Task marked as completed!');        // Confirm completion
  } else {
    console.log('Invalid task number.');             // If input invalid, show error
  }
  showMenu();                                        // Show menu again
}

// Function to prompt the user to select a task to delete
function promptDeleteTask() {
  if (todos.length === 0) {                          // If there are no tasks
    console.log('\nNo tasks to delete.');            // Inform user
    return showMenu();                               // Show menu and exit function
  }
  console.log('\nSelect the number of the task to delete:'); // Print prompt header
  todos.forEach((task, idx) => {                     // List all tasks with their numbers
    const status = task.done ? 'Completed' : 'Not completed'; // Status as text
    console.log(`${idx + 1}. (${status}) ${task.text}`);      // Print each task
  });
  rl.question('\nTask number: ', (num) => {          // Prompt for task number
    deleteTask(num);                                 // Pass input to deleteTask function
  });
}

// Function to delete the selected task
function deleteTask(num) {
  let idx = parseInt(num) - 1;                       // Convert user input to array index
  if (todos[idx]) {                                  // If a task exists at that index
    todos.splice(idx, 1);                            // Remove task from the array
    saveTasks();                                     // Save changes to file
    console.log('Task deleted!');                    // Confirm deletion
  } else {
    console.log('Invalid task number.');             // If input invalid, show error
  }
  showMenu();                                        // Show menu again
}

// Start the app by showing the main menu
showMenu();
 