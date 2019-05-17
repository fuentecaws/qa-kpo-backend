// dbConfig.js
const mysql = require('mysql')
const pool  = mysql.createPool({
  host            : process.env.RDS_HOSTNAME, 
  user            : process.env.RDS_USERNAME, 
  password        : process.env.RDS_PASSWORD, 
  database        : process.env.RDS_DATABASE  
})

module.exports = pool