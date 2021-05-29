const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');
//require('dotenv').config();
console.log(require('dotenv').config());

const connection = mysql.createConnection({
  host: 'localhost',
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: process.env.DB_USER,
  // Your password
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const start = async () => {
  const answer = await inquirer
    .prompt({
      name: 'initialChoice',
      type: 'list',
      message: 'What would you like to do?',
      choices: ["Add Departments", "Add Roles", "Add Employees", "View Deparments", "View Roles", "View Employees", "View Employees By Manager", "Update Employee Managers", "Delete Departments", "Delete Roles", "Delete Employees", "Exit",
        //   {
        //     name : "Justin Lindsey",
        //     value : 1 
        // }
      ],
    })
  console.log(answer)
  switch (answer.initialChoice) {
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
      connection.end();
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

const addRole = () => {
  //gather all the departments as an array to pass into the roleDepartment prompt
  connection.query('SELECT * FROM department', async (err, res) => {
    if (err) throw err;
    const departmentChoices = res.map(dept => {
      return { name: dept.name, value: dept.id }
    });

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
        },
        {
          name: 'roleDepartment',
          type: 'list',
          message: 'Which department does this belong in?',
          choices: departmentChoices
        }
      ])

    connection.query(
      'INSERT INTO role SET ?',
      {
        title: answer.role,
        salary: answer.salary,
        department_id: answer.roleDepartment,
      },
      (err) => {
        if (err) throw err;
        console.log('Your department was added successfully!');
        start();
      }
    );
  })
};

const addEmployee = () => {
  connection.query('SELECT * FROM role', async (err, res) => {
    if (err) throw err;
    const roleList = res.map(role => {
      return { name: role.name, value: role.id }
    });
    const managerList = {};
    connection.query('SELECT * FROM employee', (err, res) => {
      if (err) throw err;
      managerList = res.map(manager => {
        return {name: `${manager.first_name} ${manager.last_name}`, value: manager.id}
      });
    });
    const answer = await inquirer
      .prompt([
        {
          name: 'firstName',
          type: 'input',
          message: 'What is the new employee\'s first name?',
        },
        {
          name: 'lastName',
          type: 'input',
          message: 'What is the new employee\'s last name?',
        },
        {
          name: 'employeeRole',
          type: 'list',
          message: 'What is the new employee\'s role?',
          choices: roleList,
        },
        {
          name: 'employeeManager',
          type: 'list',
          message: 'Who is the new employee\'s manager?',
          choices: managerList,
        },
      ])

    connection.query(
      'INSERT INTO employee SET ?', {
      firt_name: answer.firstName,
      last_name: answer.lastName,
      role_id: answer.employeeRole,
      manager_id: answer.employeeManager,
      },
      (err) => {
        if (err) throw err;
        console.log(`${employee.firstName} ${employee.lastName} was added successfully!`);
        start();
      }
    );
  })
}




connection.connect((err) => {
  if (err) throw err;
  start();
});







// you’ll have to query the departments first with something like SELECT * FROM departments; One of those columns will be the ID and you’ll have to show the Department Name instead. You have to display Engineering
// But then translate to whatever ID it is