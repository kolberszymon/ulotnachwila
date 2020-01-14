const Pool = require('pg').Pool
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'teatr',
  password: 'admin',
  port: 5432,
})

const getPlays = (request, response) => {
  pool
  	.query('SELECT * FROM sztuka ORDER BY id ASC')
  	.then(res => response.render('pages/admin', {
  		plays: res.rows
  	}))
  	.catch(err => console.error('Error executing query', err.stack))
}

module.exports = {
	getPlays
}