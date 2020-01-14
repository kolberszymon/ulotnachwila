const Pool = require('pg').Pool
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'teatr',
  password: 'admin',
  port: 5432,
})

const getPlays = (request, response) => {
  pool.query('SELECT * FROM sztuka ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

module.exports = {
	getPlays
}