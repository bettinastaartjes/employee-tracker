const mysql = require("mysql2");
//const Connection = require("mysql2/typings/mysql/lib/Connection");

const db = mysql.createConnection ({
    host: "localhost",
    // your mySQL username,
    user: "root",
    // your mySql password
    password: "Jambo123",
    database: 'employee_tracker_db'
});

db.connect(function (err) {
    if (err) throw err;
});

module.exports = db;