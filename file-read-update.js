// Import the readline module for command-line interaction
const readline = require('readline');
// Import the fs (filesystem) module for file operations
const fs = require('fs');

// Define the file name for storing expenses in JSON format
const FILE = 'expenses.json';

// Initialize the expenses array; load data from the file if it exists
let expenses = [];
if (fs.existsSync(FILE)) { // Check if the file exists
  try {
    // Read and parse the file's contents
    expenses = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    expenses = []; // If error, start with an empty array
  }
}

// Create a readline interface for user input and output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to save the expenses array to the JSON file
function saveExpenses() {
  fs.writeFileSync(FILE, JSON.stringify(expenses, null, 2)); // Pretty-print with 2-space indentation
}

// Function to display all expenses in a table format
function printExpensesTable() {
  if (expenses.length === 0) { // If there are no expenses
    console.log('\nNo expenses recorded.');
    return;
  }
  // Print table headers
  console.log('\n# |    Date    |  Time   |  Amount  |   Category   | Description');
  console.log('---------------------------------------------------------------------');
  // Print each expense as a formatted row
  expenses.forEach((exp, idx) => {
    let row =
      String(idx + 1).padEnd(2) + '| ' +         // Expense number, padded for alignment
      exp.date.padEnd(10) + ' | ' +              // Date, padded for alignment
      exp.time.padEnd(8) + ' | $' +              // Time, padded, with dollar sign
      exp.amount.toFixed(2).padEnd(7) + '| ' +   // Amount, always 2 decimal places, padded
      exp.category.padEnd(12) + '| ' +           // Category, padded
      exp.description;                           // Description, no padding
    console.log(row);
  });
}

// Function to print summary tables (monthly or by category)
function printSummaryTable(summary, left, right) {
  // Print header with left and right column labels
  console.log(`\n${left.padEnd(20)} | ${right}`);
  console.log('-'.repeat(35));
  // Print each summary row
  Object.entries(summary).forEach(([key, val]) => {
    console.log(`${key.padEnd(20)} | $${val.toFixed(2)}`);
  });
}

// Function to export all expenses to a CSV file
function exportToCSV() {
  if (expenses.length === 0) { // If there are no expenses to export
    console.log('\nNo expenses to export.');
    return showMenu();
  }
  // Define the CSV column headers
  const headers = ['Date', 'Time', 'Amount', 'Category', 'Description'];
  // Helper to escape any CSV field with commas or quotes
  function esc(field) {
    const str = String(field);
    return (str.includes(',') || str.includes('"')) ? `"${str.replace(/"/g, '""')}"` : str;
  }
  // Start CSV with header row
  let csv = headers.join(',') + '\n';
  // Add a row for each expense, escaping fields if necessary
  expenses.forEach(e => {
    csv += [e.date, e.time, e.amount.toFixed(2), e.category, e.description].map(esc).join(',') + '\n';
  });
  // Write CSV data to file
  fs.writeFileSync('expenses.csv', csv);
  console.log('Expenses exported to expenses.csv!');
  showMenu();
}

// Function to add a new expense
function addExpense() {
  rl.question('\nEnter amount: ', amountInput => { // Ask for the expense amount
    let amount = parseFloat(amountInput);           // Convert to a number
    if (isNaN(amount) || amount <= 0) return showMenu(); // Validate input
    rl.question('Enter category: ', category => {         // Ask for the expense category
      if (!category.trim()) return showMenu();            // Validate input
      rl.question('Enter description: ', description => { // Ask for an optional description
        const now = new Date();                           // Get current date and time
        const date = now.toISOString().slice(0, 10);      // Format date as YYYY-MM-DD
        const time = now.toTimeString().slice(0, 8);      // Format time as HH:MM:SS
        // Add the new expense to the array
        expenses.push({
          amount,
          category: category.trim(),
          description: description.trim(),
          date,
          time
        });
        saveExpenses();              // Save updated expenses to the file
        console.log('Expense added!');
        showMenu();                  // Return to main menu
      });
    });
  });
}

// Function to display all expenses
function viewExpenses() {
  printExpensesTable(); // Show expenses in table format
  showMenu();           // Return to menu
}

// Function to prompt the user to delete an expense by its index/number
function deleteExpensePrompt() {
  if (expenses.length === 0) return showMenu(); // If no expenses, just return to menu
  printExpensesTable();                         // Show current expenses
  rl.question('\nEnter expense number to delete: ', num => { // Ask which expense to delete
    let idx = parseInt(num) - 1;                // Convert user input to array index
    if (expenses[idx]) {
      expenses.splice(idx, 1);                  // Remove from array
      saveExpenses();                           // Save updated data
      console.log('Expense deleted!');
    }
    showMenu();                                 // Return to menu
  });
}

// Function to display a monthly summary table
function showMonthlySummary() {
  if (expenses.length === 0) return showMenu(); // If no expenses, just return to menu
  let months = {};                              // Object to hold total for each month
  expenses.forEach(e => {
    const m = e.date.slice(0, 7);               // Extract YYYY-MM for grouping
    months[m] = (months[m] || 0) + e.amount;    // Add amount to corresponding month
  });
  printSummaryTable(months, 'Month', 'Total Spent'); // Show summary table
  showMenu();                                 // Return to menu
}

// Function to display a category summary table
function showCategorySummary() {
  if (expenses.length === 0) return showMenu(); // If no expenses, just return to menu
  let cats = {};                                // Object to hold total for each category
  expenses.forEach(e => {
    cats[e.category] = (cats[e.category] || 0) + e.amount; // Add amount per category
  });
  printSummaryTable(cats, 'Category', 'Total Spent'); // Show summary table
  showMenu();                                   // Return to menu
}

// Function to prompt the user for an expense index and show its details
function viewExpenseByIndexPrompt() {
  if (expenses.length === 0) return showMenu(); // If no expenses, just return to menu
  printExpensesTable();                         // Show all expenses
  rl.question('\nEnter expense number to view details: ', num => { // Ask for the expense number
    let idx = parseInt(num) - 1;                // Convert to array index
    if (expenses[idx]) {
      let e = expenses[idx];
      // Print all details for the selected expense
      console.log('\nExpense Details:');
      console.log(`Date:        ${e.date}`);
      console.log(`Time:        ${e.time}`);
      console.log(`Amount:      $${e.amount.toFixed(2)}`);
      console.log(`Category:    ${e.category}`);
      console.log(`Description: ${e.description}`);
    }
    showMenu();                                 // Return to menu
  });
}

// Function to display the main menu and prompt the user for an option
function showMenu() {
  console.log('\n=== Expense Tracker ===');
  console.log('1. Add Expense');
  console.log('2. View All Expenses');
  console.log('3. Delete Expense');
  console.log('4. Show Monthly Summary');
  console.log('5. Show Spending by Category');
  console.log('6. View Expense Details by Index');
  console.log('7. Export Expenses to CSV');
  console.log('8. Exit');
  rl.question('\nChoose an option (1-8): ', handleMenu); // Prompt for choice
}

// Function to handle main menu selection and route to appropriate function
function handleMenu(choice) {
  switch (choice.trim()) {
    case '1': addExpense(); break;
    case '2': viewExpenses(); break;
    case '3': deleteExpensePrompt(); break;
    case '4': showMonthlySummary(); break;
    case '5': showCategorySummary(); break;
    case '6': viewExpenseByIndexPrompt(); break;
    case '7': exportToCSV(); break;
    case '8': console.log('Goodbye!'); rl.close(); break;
    default: showMenu(); break; // Any other input just redisplays menu
  }
}

// Start the application by displaying the main menu
showMenu();