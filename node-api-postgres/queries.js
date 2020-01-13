const Pool = require('pg').Pool
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'teatr',
  password: 'admin',
  port: 3000,
})