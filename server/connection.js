// connection.js
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "127.0.0.1",      // replace with your DB host
  user: "root",           // replace with your DB username
  password: "root@123", // replace with your DB password
  database: "project lss"  // replace with your DB name
});

connection.connect((err) => {
  if (err) {
    console.error("MySQL connection failed: ", err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
});

module.exports = connection;