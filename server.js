const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

const connection = mysql.createConnection(
  
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    port: 3306,
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
      switch(answer.initialChoice) {
        case "Add departments":
          addDepartment();
          break;
        case "Add Roles":
          addRole();
          break;
        case "Add employees":
          addEmployee();
          break;
        case "View departments":
          viewDepartment();
          break;
        case "View Roles":
          viewRoles();
          break;
        case "View employees":
          viewEmployee();
          break;
        case "View employees by manager":
          employeesByManager();
          break;
        case "Update employee managers":
          updateManager();
          break;
        case "Deplete departments":
          depleteDepartment();
          break;
        case "Delete roles":
          deleteRole();
          break;
        case "Delete Employees":
          deleteEmployee();
          break;
        case "Exit":
          console.log("Have a nice day!");
      }
    //   .then((answer) => {

     
    //     }
    //   });
  };

  const addDepartment = async () => {
    const answer = await inquirer
      .prompt([
        {
          name: 'department',
          type: 'input',
          message: 'What department would you like to add?',
        },
      ])
        connection.query(
          'INSERT INTO department SET ?',
          {
            name: answer.department,
          },
          (err) => {
            if (err) throw err;
            console.log('Your department was added successfully!');
            console.log()
            start();
          }
        );
  };

  const addRole = async () => {
    //gather all the departments as an array to pass into the roleDepartment prompt
    connection.query('SELECT * FROM department', (err, res) => {
      // const departmentChoices = res.something is all the departments
      const answer = await inquirer
        .prompt([
          {
            name: 'role',
            type: 'input',
            message: 'What is the title of the role that you would like to add?',
          },
          {
            name: 'salary',
            type: 'input',
            message: 'What is the salary of this role?'
          }
          {
            name: 'roleDepartment',
            type: 'list',
            message: 'Which department does this belong in?',
            choices: departmentChoices
          }
        ])

    })
        connection.query(
          'INSERT INTO role SET ?',
          {
            name: answer.department,
          },
          (err) => {
            if (err) throw err;
            console.log('Your department was added successfully!');
            console.log()
            start();
          }
        );
  };

  connection.connect((err) => {
    if (err) throw err;
    start();
  });
  






// you’ll have to query the departments first with something like SELECT * FROM departments; One of those columns will be the ID and you’ll have to show the Department Name instead. You have to display Engineering
// But then translate to whatever ID it is