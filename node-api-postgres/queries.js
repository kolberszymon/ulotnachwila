const Pool = require('pg').Pool
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'teatr',
  password: 'admin',
  port: 5432,
})

var getPlaysFreeSitsQuery = `SELECT s.id, s.nazwa, COUNT(m.numer_miejsca) AS "wolnemiejsca" FROM sztuka s, miejsca m
WHERE s.id = m.id_sztuki AND m.wolne = true
GROUP BY s.nazwa, s.id;`

var getFreeSitsInPlay = `SELECT numer_miejsca FROM miejsca WHERE id_sztuki = $1 AND wolne = true;`

const getPlays = (request, response) => {
  pool
  	.query('SELECT * FROM sztuka ORDER BY id ASC')
  	.then(res => response.render('pages/admin', {
  		plays: res.rows
  	}))
  	.catch(err => console.error('Error executing query', err.stack))
}

const homePage = (request, response) => {
	pool
		.query(getPlaysFreeSitsQuery)
		.then(res => response.render('pages/home', {
			plays: res.rows
		}))
		.catch(err => console.error('Error executing query', err.stack))
}



const buyTicket = (request, response) => {
	var sztukaData = [];
	console.log(parseInt(request.body.id_sztuki, 10))
	pool
		.query('SELECT data_sztuki, nazwa FROM sztuka WHERE id = $1', [parseInt(request.body.id_sztuki, 10)])
		.then(res => {
			pool
				.query(getFreeSitsInPlay, [parseInt(request.body.id_sztuki, 10)])
				.then(res1 => {
					response.render('pages/buyticket', {
	  					user: request.body,
	  					sztuka: res.rows[0],
	  					miejsca: res1.rows
					});
				})
				.catch(err => console.error('Error executing query', err.stack))
		}) 
		.catch(err => console.error('Error executing query', err.stack))

}

const ticketSuccess = (request, response) => {
	console.log('success')
}

module.exports = {
	getPlays,
	homePage,
	buyTicket,
	ticketSuccess
}




