//this is the main menu for departments/employees etc.

// Variables and dependencies
const inquirer = require('inquirer');
const db = require('./db/connection');

// server startig after db connection
db.connect(err => {
    if (err) throw err;
    console.log('Database Connection Established');
    employee_tracker();
});

var employee_tracker = function () {
    inquirer.prompt ([{
        //command line
        type: 'list',
        name: 'prompt',
        message: 'What would you like to do first?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'End Session']
    }]).then((answers) => {
        // for seeing the department table in the database
        if (answers.prompt === 'View All Departments') {
            db.query(`Select * from Department`, (err, result) => {
                if (err) throw err;
                console.log ("Viewing All Departments: ");
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === 'View All Roles') {
            db.query(`Select * from Role`, (err, result) => {
                if (err) throw err;
                console.log ("Viewing All Roles: ");
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === 'View All Employees') {
            db.query(`Select * from Employee List`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Employees: ");
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === 'Add A New Department') {
            inquirer.prompt ([{
                //adding a new dept
                type: 'input',
                name: 'department',
                message: 'What is the name of the new department?',
                validate: departmentInput => {
                    if (departmentInput) {
                        return true;
                    } else {
                        console.log('Please include the name of the new department!');
                        return false;
                    }
                }
            }]).then((answers) => {
                db.query(`Add (name) values (?) into department `, [answers.department], (err, result) => {
                    if (err) throw err;
                    console.log(`Added ${answers.department} to database.`)
                    employee_tracker ();
                });
            })
        } else if (answers.prompt === 'Add New Role') {
            // starting with the database so we can get departments for choices
            db.query(`Select * from Department`, (err, result) => {
                if (err) throw err;

                inquirer.prompt ([
                    {
                        //adding a new role
                        type: 'input',
                        name: 'role',
                        message: 'What is the name of the new role?',
                        validate: roleInput => {
                            if (roleInput) {
                                return true;
                            } else {
                                console.log('Please add a new role');
                                return false;
                            }
                        }
                    },
                    {
                        // adding salary
                        type: 'input',
                        name: 'salary',
                        message: 'What is the salary of the role?',
                        validate: salaryInput => {
                            if (salaryInput) {
                                return true;
                            } else {
                                console.log('Please Add A Salary!');
                                return false;
                            }
                        }
                    },
                    {
                        // department
                        type: 'list',
                        name: 'department',
                        message: 'Which department does the role belong to?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].name);
                            }
                            return array;
                        }
                    }
                ]).then((answers) => {
                    // comparing the result and storing it into the variable
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].name === answers.department) {
                            var department = result[i];
                        }
                    }

                    db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.role, answers.salary, department.id], (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${answers.role} to the database.`)
                        employee_tracker();
                    });
                })
            });
        } else if (answers.prompt === 'Add An Employee') {
            // Calling the database to acquire the roles and managers
            db.query(`Select * from employee, role`, (err, result) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        // Adding Employee First Name
                        type: 'input',
                        name: 'firstName',
                        message: 'What is the employees first name?',
                        validate: firstNameInput => {
                            if (firstNameInput) {
                                return true;
                            } else {
                                console.log('Please Add A First Name!');
                                return false;
                            }
                        }
                    },
                    {
                        // Adding Employee Last Name
                        type: 'input',
                        name: 'lastName',
                        message: 'What is the employees last name?',
                        validate: lastNameInput => {
                            if (lastNameInput) {
                                return true;
                            } else {
                                console.log('Please Add A Salary!');
                                return false;
                            }
                        }
                    },
                    {
                        // Adding Employee Role
                        type: 'list',
                        name: 'role',
                        message: 'What is the employees role?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].title);
                            }
                            var newArray = [...new Set(array)];
                            return newArray;
                        }
                    },
                    {
                        // Adding Employee Manager
                        type: 'input',
                        name: 'manager',
                        message: 'Who is the employees manager?',
                        validate: managerInput => {
                            if (managerInput) {
                                return true;
                            } else {
                                console.log('Please Add A Manager!');
                                return false;
                            }
                        }
                    }
                ]).then((answers) => {
                    // Comparing the result and storing it into the variable
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].title === answers.role) {
                            var role = result[i];
                        }
                    }

                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, role.id, answers.manager.id], (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`)
                        employee_tracker();
                    });
                })
            });
        } else if (answers.prompt === 'Update An Employee Role') {
            // Calling the database to acquire the roles and managers
            db.query(`SELECT * FROM employee, role`, (err, result) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        // Choose an Employee to Update
                        type: 'list',
                        name: 'employee',
                        message: 'Which employees role do you want to update?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].last_name);
                            }
                            var employeeArray = [...new Set(array)];
                            return employeeArray;
                        }
                    },
                    {
                        // Updating the New Role
                        type: 'list',
                        name: 'role',
                        message: 'What is their new role?',
                        choices: () => {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                array.push(result[i].title);
                            }
                            var newArray = [...new Set(array)];
                            return newArray;
                        }
                    }
                ]).then((answers) => {
                    // Comparing the result and storing it into the variable
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].last_name === answers.employee) {
                            var name = result[i];
                        }
                    }

                    for (var i = 0; i < result.length; i++) {
                        if (result[i].title === answers.role) {
                            var role = result[i];
                        }
                    }

                    db.query(`UPDATE employee SET ? WHERE ?`, [{role_id: role}, {last_name: name}], (err, result) => {
                        if (err) throw err;
                        console.log(`Updated ${answers.employee} role to the database.`)
                        employee_tracker();
                    });
                })
            });
        } else if (answers.prompt === 'Log Out') {
            db.end();
            console.log("See ya!");
        }
    })
};