const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: 'root',
  
    // Be sure to update with your own MySQL password!
    password: 'Forgreatjustice2',
    database: 'contentManagementSystem_db',
  });

  const start = async () => {
    const answer = await inquirer
      .prompt({
        name: 'initialChoice',
        type: 'list',
        message: 'What would you like to do?',
        choices: [ "Add departments", "Add Roles", "Add employees", "View deparments", "View roles", "View employees", "View employees by manager", "Update employee managers", "Delete departments", "Delete roles", "Delete employees", "Exit",
      //   {
      //     name : "Justin Lindsey",
      //     value : 1 
      // }
],
      })
      console.log(answer)
      switch(answer) {
        case "Add departments":
          addDepartments();
          break;
        case "Add Roles":
          addRoles();
          break;
        case "Add employees":
          addEmployees();
          break;
        case "View departments":
          viewDepartments();
          break;
        case "View Roles":
          viewRoles();
          break;
        case "View employees":
          viewEmployees();
          break;
        case "View employees by manager":
          employeesByManager();
          break;
        case "Update employee managers":
          updateManagers();
          break;
        case "Deplete departments":
          depleteDepartments();
          break;
        case "Delete roles":
          deleteRoles();
          break;
        case "Delete Employees":
          deleteEmployees();
          break;
        case "Exit":
          console.log("Have a nice day!");
          break;
      }
    //   .then((answer) => {

     
    //     }
    //   });
  };

  connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });
  






// you’ll have to query the departments first with something like SELECT * FROM departments; One of those columns will be the ID and you’ll have to show the Department Name instead. You have to display Engineering
// But then translate to whatever ID it is