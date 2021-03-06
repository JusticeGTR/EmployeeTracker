const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');
require('dotenv').config();

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
      choices: ["Add Departments", "Add Roles", "Add Employees", "View Departments", "View Roles", "View Employees", "Exit",
        //   {
        //     name : "Justin Lindsey",
        //     value : 1 
        // }
      ],
    })
  console.log(answer)
  switch (answer.initialChoice) {
    case "Add Departments":
      addDepartment();
      break;
    case "Add Roles":
      addRole();
      break;
    case "Add Employees":
      addEmployee();
      break;
    case "View Departments":
      viewDepartment();
      break;
    case "View Roles":
      viewRoles();
      break;
    case "View Employees":
      viewEmployee();
      break;
    // case "View Employees By Manager":
    //   employeesByManager();
    //   break;
    // case "Update Employee Managers":
    //   updateManager();
    //   break;
    // case "Delete Departments":
    //   depleteDepartment();
    //   break;
    // case "Delete Roles":
    //   deleteRole();
    //   break;
    // case "Delete Employees":
    //   deleteEmployee();
    //   break;
    case "Exit":
      console.log("Have a nice day!");
      connection.end();
  }
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
        return { name: `${manager.first_name} ${manager.last_name}`, value: manager.id }
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

// const updateManager = () => {
//   //gather all the departments as an array to pass into the roleDepartment prompt
//   connection.query('SELECT * FROM role', async (err, res) => {
//     if (err) throw err;
//     const managerList = res.map(manager => {
//       return { name: manager.title, value: manager.id }
//     });
//     connection.query('SELECT name * employee', (err, res) => {
//       if (err) throw err;
//       employeeList = res.map(employee => {
//         return { name: `${employee.first_name} ${employee.last_name}`, value: employee.id }
//       });
//     })

//     const answer = await inquirer
//       .prompt([
//         {
//           name: 'oldRole',
//           type: 'list',
//           message: 'Who\'s role would you like to change?',
//           choices: employeeList,
//         },
//         {
//           name: 'newManager',
//           type: 'list',
//           message: 'Who is their new manager?',
//           choices: managerList
//         },
//       ])

//     connection.query(
//       'UPDATE employee SET ?',
//       {
//         manager_id: answer.newManager,
//       },
//       (err) => {
//         if (err) throw err;
//         console.log(`${employee.first_name} ${employee.last_name}'s manager was updated successfully!`);
//         start();
//       }
//     );
//   })
// };

const viewDepartment = () => {
  connection.query('SELECT name, id AS value FROM department', async (err, res) => {
    if (err) throw err;
    const deptList = res;
    console.log(deptList)
    
    const answer = await inquirer
    .prompt({
      name: 'departments',
      type: 'list',
      message: 'Which department would you like to view?',
      choices: deptList
    })

    connection.query(`SELECT role.title AS role, CONCAT(m.first_name, " ", m.last_name) AS Manager, CONCAT(e.first_name," ", e.last_name) AS Employee
    FROM employee e 
    JOIN role 
    ON e.role_id = role.id 
    JOIN department d 
    ON role.department_id = d.id 
    JOIN employee m 
    ON e.manager_id = m.id WHERE d.id = ${answer.departments};`, (err, res) => {
      if (err) throw err;
      console.table(res)
      start();
    });
  })
    }

const viewRoles = () => {
  connection.query('SELECT title, id AS value FROM role', async (err, res) => {
    if (err) throw err;
    const roleList = res;

    const answer = await inquirer
    .prompt({
      name: 'roles',
      type: 'list',
      message: 'Which role would you like to view?',
      choices: roleList,
    })
    connection.query(`SELECT role.title AS role, CONCAT(m.first_name, " ", m.last_name) AS Manager, CONCAT(e.first_name," ", e.last_name) AS Employee
    FROM employee e
    JOIN role 
    ON e.role_id = role.id
    JOIN employee AS m 
    ON e.manager_id = m.id WHERE e.role_id = ${answer.roles};`, (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    });
  });
}


const viewEmployee = async () => {
  const fullEmployee =  `SELECT e.id, CONCAT(e.first_name, " ", e.last_name) AS Employee, r.title, CONCAT(m.first_name," ", m.last_name) AS Manager
  FROM employee e
  JOIN role r
  ON 
  -- table1.column_name = table2.column_name;
  e.role_id = r.id
  JOIN employee m
  ON e.manager_id = m.id;`
  // fullEmployee = 'SELECT * FROM employeeSELECT * FROM roleINNER JOIN employee'
  await connection.query(fullEmployee, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  })
}

connection.connect((err) => {
  if (err) throw err;
  start();
});
